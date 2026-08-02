import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';
import { UserPreferenceService } from './services/user-preference.service';
import { MadhhabRegistryService } from './registries/madhhab.registry';
import { CurrencyRegistryService } from './registries/currency.registry';
import { LanguageRegistryService } from './registries/language.registry';
import { CalculationProfileResolverService } from './services/calculation-profile-resolver.service';
import { CalculationProfileSnapshotService } from './services/calculation-profile-snapshot.service';

export class ProfileController {
  static async getUserPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const pref = await UserPreferenceService.getOrCreate(userId);
      return sendSuccess(res, pref, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async updateUserPreferences(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const pref = await UserPreferenceService.update(userId, req.body);
      return sendSuccess(res, pref, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getMadhhabs(_req: Request, res: Response) {
    try {
      const list = MadhhabRegistryService.getAll();
      return sendSuccess(res, list, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getCurrencies(_req: Request, res: Response) {
    try {
      const list = CurrencyRegistryService.getAll();
      return sendSuccess(res, list, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getLanguages(_req: Request, res: Response) {
    try {
      const list = LanguageRegistryService.getAll();
      return sendSuccess(res, list, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async resolveProfilePreview(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { module, calculationOverrides, saveAsDefault } = req.body;

      if (!module || (module !== 'MIRATH' && module !== 'ZAKAT')) {
        return sendError(res, 'Valid module (\'MIRATH\' or \'ZAKAT\') is required', 400);
      }

      const result = await CalculationProfileResolverService.resolveProfile({
        userId,
        module,
        calculationOverrides,
        saveAsDefault,
      });

      return sendSuccess(res, result, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getCalculationProfile(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const snapshot = await CalculationProfileSnapshotService.getSnapshotByCalculationId(calculationId);

      if (!snapshot) {
        return sendError(res, 'Calculation profile snapshot not found', 404);
      }

      // Perform integrity verification check
      await CalculationProfileSnapshotService.verifySnapshotIntegrity(calculationId);

      return sendSuccess(res, snapshot, 200);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
