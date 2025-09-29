import 'server-only';
import { TRPCError } from '@trpc/server';
import { baseProcedure } from '../init';

export const authMiddleware = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});
