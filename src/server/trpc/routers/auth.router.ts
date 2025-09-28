import 'server-only';
import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { publicProcedure } from '../procedures/publicProcedure';

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user ?? null;
  }),
});
