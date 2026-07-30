import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';
import { authenticate } from './auth.middleware';

export const adminMiddleware = [
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return sendError(res, 'Unauthorized', 401);
    }

    // Since 'role' may not be in the Prisma schema natively, we cast to any.
    // Also falling back to checking an ADMIN_EMAIL env variable for safety.
    if (user.role !== 'ADMIN' && user.email !== process.env.ADMIN_EMAIL) {
      return sendError(res, 'Forbidden: Admin access required', 403);
    }

    next();
  }
];
