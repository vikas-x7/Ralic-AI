import 'server-only';
import { auth } from './auth';
import { db } from './db';

export async function createContext() {
  const session = await auth();

  return {
    session,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
