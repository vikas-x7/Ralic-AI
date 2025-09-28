import 'server-only';
import { createTRPCRouter } from '../init';
import { authRouter } from './auth.router';
import { userRouter } from './user.router';
import { chatRouter } from './chat.router';
import { dashboardRouter } from './dashboard.router';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  chat: chatRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
