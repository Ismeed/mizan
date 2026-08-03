/**
 * Currency Routes
 * Phase 12 — MIZAN Currency Architecture
 */

import { Router } from 'express';
import { CurrencyController } from './currency.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/currencies', CurrencyController.getCurrencies);
router.get('/currencies/:currencyCode', CurrencyController.getCurrencyByCode);
router.post('/money/parse', CurrencyController.parseMoney);
router.post('/currency/convert/preview', CurrencyController.convertPreview);
router.get('/exchange-rates/:snapshotId', CurrencyController.getExchangeRateSnapshot);
router.post('/ai/currency-context', authMiddleware, CurrencyController.getAICurrencyContext);

export const currencyRouter = router;
