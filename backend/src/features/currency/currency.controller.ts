/**
 * Currency Controller
 * Phase 12 — MIZAN Currency Architecture
 */

import { Request, Response } from 'express';
import { CurrencyRegistryService } from './services/currency-registry.service';
import { CurrencyValidationService } from './services/currency-validation.service';
import { MoneyInputParserService } from './services/money-input-parser.service';
import { CurrencyConversionService } from './services/currency-conversion.service';
import { ExchangeRateSnapshotService } from './services/exchange-rate-snapshot.service';
import { AICurrencyContextService } from './services/ai-currency-context.service';

export class CurrencyController {
  public static async getCurrencies(req: Request, res: Response): Promise<void> {
    try {
      const countryCode = req.query.countryCode as string | undefined;
      const languageTag = req.query.languageTag as string | undefined;
      const currencies = CurrencyRegistryService.getSupportedCurrencies({ countryCode, languageTag });

      res.status(200).json({ status: 'SUCCESS', data: currencies });
    } catch (err: any) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  }

  public static async getCurrencyByCode(req: Request, res: Response): Promise<void> {
    try {
      const { currencyCode } = req.params;
      const currency = CurrencyRegistryService.getCurrency(currencyCode);

      if (!currency) {
        res.status(404).json({ status: 'ERROR', message: `Currency '${currencyCode}' not found` });
        return;
      }

      res.status(200).json({ status: 'SUCCESS', data: currency });
    } catch (err: any) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  }

  public static async parseMoney(req: Request, res: Response): Promise<void> {
    try {
      const { amountString, currencyCode, locale } = req.body;
      const money = MoneyInputParserService.parseMoneyInput(amountString, currencyCode, locale);

      res.status(200).json({ status: 'SUCCESS', data: money });
    } catch (err: any) {
      res.status(400).json({ status: 'ERROR', message: err.message });
    }
  }

  public static async convertPreview(req: Request, res: Response): Promise<void> {
    try {
      const { sourceMoney, targetCurrencyCode, valuationDate, conversionPurpose } = req.body;
      const conversionRequestId = `CONV-REQ-${Date.now()}`;

      const result = CurrencyConversionService.convertMoney({
        conversionRequestId,
        sourceMoney,
        targetCurrencyCode,
        valuationDate,
        conversionPurpose: conversionPurpose || 'USER_REQUESTED_CONVERSION',
        requestedAt: new Date().toISOString(),
      });

      res.status(200).json({ status: 'SUCCESS', data: result });
    } catch (err: any) {
      if (err.missingResponse) {
        res.status(422).json({ status: 'EXCHANGE_RATE_UNAVAILABLE', data: err.missingResponse });
        return;
      }
      res.status(400).json({ status: 'ERROR', message: err.message });
    }
  }

  public static async getExchangeRateSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const { snapshotId } = req.params;
      const snapshot = ExchangeRateSnapshotService.getSnapshot(snapshotId);

      if (!snapshot) {
        res.status(404).json({ status: 'ERROR', message: `Snapshot '${snapshotId}' not found` });
        return;
      }

      res.status(200).json({ status: 'SUCCESS', data: snapshot });
    } catch (err: any) {
      res.status(500).json({ status: 'ERROR', message: err.message });
    }
  }

  public static async getAICurrencyContext(req: Request, res: Response): Promise<void> {
    try {
      const { calculationId, module, selectedMadhhab, languageTag, shareOrRate, sourceMoney, targetMoney, calculationCurrencyCode } = req.body;

      const aiPackage = AICurrencyContextService.buildContextPackage({
        calculationId,
        module,
        selectedMadhhab,
        languageTag,
        shareOrRate,
        sourceMoney,
        targetMoney,
        calculationCurrencyCode,
      });

      res.status(200).json({ status: 'SUCCESS', data: aiPackage });
    } catch (err: any) {
      res.status(400).json({ status: 'ERROR', message: err.message });
    }
  }
}
