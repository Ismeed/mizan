import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';

/** General API rate limiter — 100 requests per 15 minutes */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Strict limiter for auth endpoints — 10 attempts per hour */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

/**
 * Create a custom rate limiter middleware.
 * @param max      Max requests in the window
 * @param windowS  Window duration in seconds
 */
export function rateLimitMiddleware(max: number, windowS: number): RequestHandler {
  return rateLimit({
    windowMs: windowS * 1000,
    max,
    message: { success: false, message: 'Rate limit exceeded. Please slow down.' },
  }) as unknown as RequestHandler;
}
