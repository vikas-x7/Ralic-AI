import 'server-only';
import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { protectedProcedure } from '../procedures/protectedProcedure';

export const chatRouter = createTRPCRouter({
  getChats: protectedProcedure.query(async ({ ctx }) => {
    // TODO: replace with real chat model queries
    return [];
  }),

  createChat: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200).default('New Chat'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: replace with real chat model mutation
      return { id: crypto.randomUUID(), title: input.title };
    }),
});
