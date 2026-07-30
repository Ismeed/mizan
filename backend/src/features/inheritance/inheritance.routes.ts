import { Router } from 'express';
import { inheritanceController } from './inheritance.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { calculateInheritanceSchema } from './inheritance.validators';

export const inheritanceRouter = Router();

// All inheritance routes require authentication
inheritanceRouter.use(authMiddleware);

inheritanceRouter.post(
  '/calculate',
  validate(calculateInheritanceSchema),
  inheritanceController.calculate,
);

inheritanceRouter.get('/history',  inheritanceController.getHistory);
inheritanceRouter.get('/:id',      inheritanceController.getById);
inheritanceRouter.delete('/:id',   inheritanceController.delete);
