import 'server-only';
import { createTRPCRouter } from '../init';
import { protectedProcedure } from '../procedures/protectedProcedure';

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // TODO: aggregate real dashboard stats from DB
    return {
      totalChats: 0,
      userId: ctx.user.id,
    };
  }),
});
