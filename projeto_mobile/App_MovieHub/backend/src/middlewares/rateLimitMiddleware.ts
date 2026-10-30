import type { NextFunction, Request, Response } from 'express';

interface RateLimitOptions {
  limit: number;
  windowMs: number;
  message: string;
}

/** Process-local limiter; use a shared store if the API is scaled to multiple instances. */
export function rateLimitMiddleware({ limit, windowMs, message }: RateLimitOptions) {
  const clients = new Map<string, { count: number; resetAt: number }>();
  let requestsSinceCleanup = 0;

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const clientId = req.ip || req.socket.remoteAddress || 'unknown';
    let client = clients.get(clientId);

    if (!client || client.resetAt <= now) {
      client = { count: 0, resetAt: now + windowMs };
      clients.set(clientId, client);
    }

    client.count += 1;
    requestsSinceCleanup += 1;
    if (requestsSinceCleanup >= 256) {
      requestsSinceCleanup = 0;
      for (const [key, entry] of clients) {
        if (entry.resetAt <= now) clients.delete(key);
      }
      while (clients.size > 20_000) {
        const oldestClientId = clients.keys().next().value;
        if (oldestClientId === undefined) break;
        clients.delete(oldestClientId);
      }
    }

    if (client.count > limit) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((client.resetAt - now) / 1000))));
      return res.status(429).json({ error: message });
    }
    return next();
  };
}
