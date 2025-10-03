import { z } from 'zod';
import { auth } from '@/server/auth';
import { db } from '@/server/db';
import {
  DEFAULT_NVIDIA_MODEL,
  NVIDIA_RESPONSE_TIMEOUT_MS,
  fetchNvidiaChatStream,
  requireNvidiaApiKey,
} from '@/server/ai/nvidia';
import {
  getMemoryUserId,
  rememberConversation,
  withUserMemory,
} from '@/server/ai/memory';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});

const streamRequestSchema = z.object({
  chatId: z.string().min(1),
  nodeId: z.string().min(1).default('root'),
  messages: z.array(chatMessageSchema).min(1).max(50),
  model: z.string().min(1).default(DEFAULT_NVIDIA_MODEL),
});

function getUserId(user: { id?: string | null }) {
  return user.id || null;
}

function getTitleFromMessage(message: string) {
  const title = message.replace(/\s+/g, ' ').trim();

  if (!title) return 'New Chat';

  return title.length > 60 ? `${title.slice(0, 57)}...` : title;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let apiKey: string;

  try {
    apiKey = requireNvidiaApiKey();
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'NVIDIA_API_KEY is missing in the environment.',
      },
      { status: 412 }
    );
  }

  const parsedInput = streamRequestSchema.safeParse(await request.json());

  if (!parsedInput.success) {
    return Response.json(
      { error: 'Invalid chat request.', details: parsedInput.error.flatten() },
      { status: 400 }
    );
  }

  const userId = getUserId(session.user);

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chat = await db.chat.findFirst({
    where: {
      id: parsedInput.data.chatId,
      userId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (!chat) {
    return Response.json({ error: 'Chat not found.' }, { status: 404 });
  }

  const memoryUserId = getMemoryUserId(session.user);
  const latestUserMessage = [...parsedInput.data.messages]
    .reverse()
    .find((message) => message.role === 'user');

  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    NVIDIA_RESPONSE_TIMEOUT_MS
  );
  const abortRequest = () => {
    clearTimeout(timeout);
    abortController.abort();
  };

  request.signal.addEventListener('abort', abortRequest, { once: true });

  try {
    const messagesWithMemory = await withUserMemory({
      userId: memoryUserId,
      messages: parsedInput.data.messages,
    });
    const stream = await fetchNvidiaChatStream({
      apiKey,
      model: parsedInput.data.model,
      messages: messagesWithMemory,
      signal: abortController.signal,
    });
    const decoder = new TextDecoder();
    let assistantResponse = '';

    return new Response(
      stream.pipeThrough(
        new TransformStream<Uint8Array, Uint8Array>({
          transform(chunk, controller) {
            assistantResponse += decoder.decode(chunk, { stream: true });
            controller.enqueue(chunk);
          },
          async flush() {
            assistantResponse += decoder.decode();
            clearTimeout(timeout);
            request.signal.removeEventListener('abort', abortRequest);
            const assistantMessage = assistantResponse.trim();

            await db.$transaction(async (tx) => {
              const lastMessage = await tx.chatMessage.findFirst({
                where: { chatId: parsedInput.data.chatId },
                orderBy: { order: 'desc' },
                select: { order: true },
              });
              const nextOrder = (lastMessage?.order ?? -1) + 1;

              await tx.chatMessage.createMany({
                data: [
                  {
                    chatId: parsedInput.data.chatId,
                    nodeId: parsedInput.data.nodeId,
                    role: 'user',
                    content: latestUserMessage?.content || '',
                    order: nextOrder,
                  },
                  {
                    chatId: parsedInput.data.chatId,
                    nodeId: parsedInput.data.nodeId,
                    role: 'assistant',
                    content:
                      assistantMessage ||
                      'No response returned from the model.',
                    order: nextOrder + 1,
                  },
                ],
              });

              if (chat.title === 'New Chat' && latestUserMessage?.content) {
                await tx.chat.update({
                  where: { id: parsedInput.data.chatId },
                  data: {
                    title: getTitleFromMessage(latestUserMessage.content),
                  },
                });
              }
            });

            await rememberConversation({
              userId: memoryUserId,
              userMessage: latestUserMessage?.content || '',
              assistantMessage,
            });
          },
        })
      ),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    clearTimeout(timeout);

    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'NVIDIA response timed out. Try again with a shorter prompt.'
        : error instanceof Error
          ? error.message
          : 'Failed to get AI response.';

    return Response.json({ error: message }, { status: 500 });
  }
}
