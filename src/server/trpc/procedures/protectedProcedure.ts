import 'server-only';
import { authMiddleware } from '../middlewares/auth.middleware';

export const protectedProcedure = authMiddleware;
