import 'server-only';
import { auth } from '@/backend/auth';
import { ApiError, badRequest, unauthorized } from './errors';
import { z } from 'zod';
import { apiError } from './error-handler';
import { successResponse } from './http-response';
import { rateLimit } from './rate-limit';
import { logger } from '@/backend/logging/logger';

async function requireUserSession() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) throw unauthorized();
  return user;
}

async function parseJsonBody(req: Request) {
  return req.json().catch(() => ({}));
}

function parsePagination(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  return {
    limit: searchParams.get('limit'),
    offset: searchParams.get('offset'),
    search: searchParams.get('search'),
    riskLevel: searchParams.get('riskLevel')
  };
}

function parseSearchQuery(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  return {
    limit: searchParams.get('limit'),
    offset: searchParams.get('offset'),
    search: searchParams.get('search')
  };
}

function safeIdParam(req: Request, key = 'id') {
  const value = new URL(req.url).searchParams.get(key);
  if (!value) throw badRequest(`${key} is required`);
  return value;
}

// --- Standardized Route Lifecycle Wrapper ---

export interface RateLimitConfig {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RouteHandlerConfig<TBody = any> {
  auth?: 'user' | 'none' | 'optional';
  rateLimit?: RateLimitConfig;
  schema?: z.ZodType<TBody>;
  handler: (args: {
    req: Request;
    user: any;
    body: TBody;
    searchParams: URLSearchParams;
  }) => Promise<any>;
}

/**
 * Higher-Order Function that wraps Next.js App Router endpoints.
 * Centralizes authentication, rate limiting, request validation, execution logging, and error handling.
 */
export function createRouteHandler<TBody = any>(config: RouteHandlerConfig<TBody>) {
  return async (req: Request) => {
    const startTime = Date.now();
    const url = new URL(req.url);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    let user: any = null;

    try {
      // 1. Session Validation
      if (config.auth === 'optional') {
        try {
          const session = await auth();
          user = session?.user || null;
        } catch {
          user = null;
        }
      } else if (config.auth !== 'none') {
        // default to user validation unless explicitly 'none' or 'optional'
        user = await requireUserSession();
      }

      // 2. Rate Limiting
      if (config.rateLimit) {
        const identifier = user?.id || ip;
        const rl = rateLimit(identifier, config.rateLimit.key, config.rateLimit.limit, config.rateLimit.windowMs);
        if (!rl.success) {
          logger.logSecurity(`Rate limit triggered for ${url.pathname}`, { ip, userId: user?.id, resetMs: rl.resetMs });
          throw new ApiError('Too many requests. Please try again later.', 429);
        }
      }

      // 3. Request Payload Zod Validation
      let body: any = undefined;
      if (config.schema) {
        const rawBody = await parseJsonBody(req);
        body = config.schema.parse(rawBody);
      }

      // 4. Core Handler Execution
      const result = await config.handler({
        req,
        user,
        body,
        searchParams: url.searchParams,
      });

      const durationMs = Date.now() - startTime;
      logger.info(`API success: ${req.method} ${url.pathname} (${durationMs}ms)`, {
        userId: user?.id,
        durationMs,
      });

      return successResponse(result);
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      logger.error(`API failure: ${req.method} ${url.pathname} (${durationMs}ms)`, error, {
        userId: user?.id,
        durationMs,
      });
      return apiError(error);
    }
  };
}
