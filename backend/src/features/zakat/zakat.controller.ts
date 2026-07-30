import { Request, Response, NextFunction } from 'express';
import { ZakatService } from './zakat.service';
import { sendSuccess } from '../../shared/utils/response.utils';

const service = new ZakatService();

export const zakatController = {
  /**
   * POST /api/zakat/calculate
   */
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { assets, liabilities, currency, hawlMet, nisabOverride } = req.body;

      const { calculationId, result } = await service.calculate({
        userId,
        assets:      assets      ?? {},
        liabilities: liabilities ?? 0,
        currency:    currency    ?? 'USD',
        hawlMet:     hawlMet     ?? true,
        nisabOverride,
      });

      sendSuccess(res, { calculationId, result }, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/zakat/history
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      sendSuccess(res, await service.getHistory(userId));
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/zakat/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      sendSuccess(res, await service.getById(req.params.id, userId));
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/zakat/nisab-rates  (public — no auth needed)
   */
  async getNisabRates(_req: Request, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, await service.getNisabRates());
    } catch (err) {
      next(err);
    }
  },
};
