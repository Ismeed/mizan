/**
 * Calculation Currency Context Service
 * Phase 12 — MIZAN Currency Architecture
 */

import crypto from 'crypto';
import { CalculationCurrencyContext, CurrencyMode } from '@mizan/shared';
import { CurrencyRegistryService } from './currency-registry.service';

export class CalculationCurrencyContextService {
  public static createCurrencyContext(input: {
    calculationId: string;
    calculationProfileId: string;
    preferredCurrencyCode: string;
    calculationCurrencyCode?: string;
    reportCurrencyCode?: string;
    currencyMode?: CurrencyMode;
    valuationDatePolicyId?: string;
  }): CalculationCurrencyContext {
    const prefCode = input.preferredCurrencyCode.toUpperCase();
    const calcCode = (input.calculationCurrencyCode || prefCode).toUpperCase();
    const repCode = (input.reportCurrencyCode || calcCode).toUpperCase();

    // Validate currencies
    CurrencyRegistryService.validateCurrencyForCalculation(prefCode, 'MIRATH');
    CurrencyRegistryService.validateCurrencyForCalculation(calcCode, 'MIRATH');

    const currencyContextId = `CURR-CTX-${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();
    const valuationDatePolicyId = input.valuationDatePolicyId || 'VALUATION-DATE-MIRATH-001';
    const currencyMode: CurrencyMode = input.currencyMode || 'SINGLE_CURRENCY';

    const registryVersions = {
      currencyRegistryVersion: '1.0.0',
      exchangeRatePolicyVersion: '1.0.0',
      roundingPolicyVersion: '1.0.0',
    };

    const checksumPayload = JSON.stringify({
      currencyContextId,
      calculationId: input.calculationId,
      calculationProfileId: input.calculationProfileId,
      preferredCurrencyCode: prefCode,
      calculationCurrencyCode: calcCode,
      reportCurrencyCode: repCode,
      currencyMode,
      registryVersions,
      valuationDatePolicyId,
      createdAt,
    });

    const checksum = crypto.createHash('sha256').update(checksumPayload).digest('hex');

    return {
      currencyContextId,
      calculationId: input.calculationId,
      calculationProfileId: input.calculationProfileId,
      preferredCurrencyCode: prefCode,
      calculationCurrencyCode: calcCode,
      reportCurrencyCode: repCode,
      currencyMode,
      registryVersions,
      valuationDatePolicyId,
      createdAt,
      frozenAt: createdAt,
      checksum,
      isImmutable: true,
    };
  }
}
