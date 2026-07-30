import { Router } from 'express';
import { zakatController } from './zakat.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { calculateZakatSchema } from './zakat.validators';

export const zakatRouter = Router();

// Public route — Nisab rates do not require login
zakatRouter.get('/nisab-rates', zakatController.getNisabRates);

// All remaining routes require auth
zakatRouter.use(authMiddleware);

zakatRouter.post('/calculate', validate(calculateZakatSchema), zakatController.calculate);
zakatRouter.get('/history',    zakatController.getHistory);
zakatRouter.get('/:id',        zakatController.getById);
