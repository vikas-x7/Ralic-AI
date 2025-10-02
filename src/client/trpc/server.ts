import 'server-only';
import { createCallerFactory } from '@/server/trpc/init';
import { appRouter } from '@/server/trpc/routers/_app';
import { createContext } from '@/server/context';

const createCaller = createCallerFactory(appRouter);

export const serverTrpc = createCaller(createContext);
