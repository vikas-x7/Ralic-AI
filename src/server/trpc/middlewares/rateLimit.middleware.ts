import 'server-only';
import { TRPCError } from '@trpc/server';
import { baseProcedure } from '../init';

const requestMap = new Map<string, number[]>();

export function rateLimitMiddleware(maxRequests = 60, windowMs = 60_000) {
  return baseProcedure.use(({ ctx, next }) => {
    const key = ctx.session?.user?.email ?? 'anonymous';
    const now = Date.now();
    const windowStart = now - windowMs;

    const requests = (requestMap.get(key) ?? []).filter(
      (ts) => ts > windowStart
    );
    requests.push(now);
    requestMap.set(key, requests);

    if (requests.length > maxRequests) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Max ${maxRequests} requests per minute.`,
      });
    }

    return next();
  });
}
