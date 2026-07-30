import { Request, Response, NextFunction } from 'express';
import { InheritanceService } from './inheritance.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

const service = new InheritanceService();

export const inheritanceController = {
  /**
   * POST /api/inheritance/calculate
   * Runs the Mirath engine and persists the result.
   */
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { totalEstate, debts, funeralExpenses, wasiyyah, currency, madhhab, notes, heirs } = req.body;

      const { calculationId, result } = await service.calculate({
        userId,
        totalEstate,
        debts:           debts           ?? 0,
        funeralExpenses: funeralExpenses ?? 0,
        wasiyyah:        wasiyyah        ?? 0,
        currency:        currency        ?? 'USD',
        madhhab:         madhhab         ?? 'HANAFI',
        notes,
        heirs,
      });

      sendSuccess(res, { calculationId, result }, 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/inheritance/history
   * Returns all past inheritance calculations for the authenticated user.
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const history = await service.getHistory(userId);
      sendSuccess(res, history);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/inheritance/:id
   * Returns a single inheritance calculation (ownership enforced).
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      const calculation = await service.getById(id, userId);
      sendSuccess(res, calculation);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/inheritance/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      await service.delete(id, userId);
      sendSuccess(res, { message: 'Calculation deleted' });
    } catch (err) {
      next(err);
    }
  },
};
