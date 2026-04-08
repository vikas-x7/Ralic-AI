import 'server-only';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  DEFAULT_NVIDIA_MODEL,
  NVIDIA_RESPONSE_TIMEOUT_MS,
  fetchNvidiaChatCompletion,
  requireNvidiaApiKey,
} from '@/server/ai/nvidia';
import {
  getMemoryUserId,
  rememberConversation,
  withUserMemory,
} from '@/server/ai/memory';
import { createTRPCRouter } from '../init';
import { protectedProcedure } from '../procedures/protectedProcedure';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const canvasSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string().min(1),
      type: z.string().optional(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
      data: z
        .object({
          customId: z.string().min(1),
          initialInput: z.string().optional(),
        })
        .optional(),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string().min(1),
      source: z.string().min(1),
      sourceHandle: z.string().nullable().optional(),
      target: z.string().min(1),
      targetHandle: z.string().nullable().optional(),
      type: z.string().optional(),
      animated: z.boolean().optional(),
    })
  ),
});

function getUserId(user: { id?: string | null }) {
  if (!user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User id is missing from the session.',
    });
  }

  return user.id;
}

export const chatRouter = createTRPCRouter({
  getChats: protectedProcedure.query(async ({ ctx }) => {
    const userId = getUserId(ctx.user);

    return ctx.db.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  searchChats: protectedProcedure
    .input(
      z.object({
        query: z.string().trim().max(120),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = getUserId(ctx.user);
      const query = input.query.trim();

      if (!query) {
        return [];
      }

      return ctx.db.chat.findMany({
        where: {
          userId,
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              messages: {
                some: {
                  content: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            },
          ],
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
        select: {
          id: true,
          title: true,
          updatedAt: true,
          messages: {
            where: {
              content: {
                contains: query,
                mode: 'insensitive',
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });
    }),

  getChat: protectedProcedure
    .input(z.object({ chatId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = getUserId(ctx.user);
      const chat = await ctx.db.chat.findFirst({
        where: {
          id: input.chatId,
          userId,
        },
        include: {
          messages: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!chat) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat not found.',
        });
      }

      return chat;
    }),

  saveCanvas: protectedProcedure
    .input(
      z.object({
        chatId: z.string().min(1),
        canvas: canvasSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx.user);
      const chat = await ctx.db.chat.updateMany({
        where: {
          id: input.chatId,
          userId,
        },
        data: {
          canvas: input.canvas,
        },
      });

      if (!chat.count) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chat not found.',
        });
      }

      return { ok: true };
    }),

  createChat: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200).default('New Chat'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = getUserId(ctx.user);
      const emptyChat = await ctx.db.chat.findFirst({
        where: {
          userId,
          messages: {
            none: {},
          },
        },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          title: true,
        },
      });

      if (emptyChat) {
        return ctx.db.chat.update({
          where: { id: emptyChat.id },
          data: { updatedAt: new Date() },
          select: {
            id: true,
            title: true,
          },
        });
      }

      return ctx.db.chat.create({
        data: {
          title: input.title,
          userId,
        },
        select: {
          id: true,
          title: true,
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        messages: z.array(chatMessageSchema).min(1).max(50),
        model: z.string().min(1).default(DEFAULT_NVIDIA_MODEL),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let apiKey: string;

      try {
        apiKey = requireNvidiaApiKey();
      } catch (error) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message:
            error instanceof Error
              ? error.message
              : 'NVIDIA_API_KEY is missing in the environment.',
        });
      }

      const abortController = new AbortController();
      const timeout = setTimeout(
        () => abortController.abort(),
        NVIDIA_RESPONSE_TIMEOUT_MS
      );

      try {
        const memoryUserId = getMemoryUserId(ctx.user);
        const latestUserMessage = [...input.messages]
          .reverse()
          .find((message) => message.role === 'user');
        const messagesWithMemory = await withUserMemory({
          userId: memoryUserId,
          messages: input.messages,
        });
        const text = await fetchNvidiaChatCompletion({
          apiKey,
          model: input.model,
          messages: messagesWithMemory,
          signal: abortController.signal,
        });
        const content = text.trim() || 'No response returned from the model.';

        await rememberConversation({
          userId: memoryUserId,
          userMessage: latestUserMessage?.content || '',
          assistantMessage: content,
        });

        return {
          role: 'assistant' as const,
          content,
          model: input.model,
        };
      } catch (error) {
        const message =
          error instanceof Error && error.name === 'AbortError'
            ? 'NVIDIA response timed out. Try again with a shorter prompt.'
            : error instanceof Error
              ? error.message
              : 'Failed to get AI response.';

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message,
        });
      } finally {
        clearTimeout(timeout);
      }
    }),
});
