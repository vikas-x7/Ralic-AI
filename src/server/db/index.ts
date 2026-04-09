import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaSchemaVersion: string | undefined;
};

const PRISMA_SCHEMA_VERSION = '20260503000000_add_chat_pinning';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
}

export const db =
  globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
    ? (globalForPrisma.prisma ?? createPrismaClient())
    : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
}
