import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { prisma } from '../../config/database';
import { sendError } from '../utils/response.utils';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'Unauthorized: Access token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return sendError(res, 'Unauthorized: Invalid or expired token', 401);
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return sendError(res, 'Account not found.', 401);
    }

    (req as any).user = {
      ...user,
      userId: user.id,
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', 401);
  }
};

export const authMiddleware = authenticate;
