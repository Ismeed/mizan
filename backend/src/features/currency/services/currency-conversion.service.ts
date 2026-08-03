/**
 * Currency Conversion Service
 * Phase 12 — MIZAN Currency Architecture
 *
 * Authoritative currency conversion service.
 * NEVER calls AI. NEVER alters Islamic rules.
 */

import crypto from 'crypto';
import Decimal from 'decimal.js';
import {
  CurrencyConversionRequest,
  MissingRateResponse,
  MoneyValue,
} from '@mizan/shared';
import { CurrencyRegistryService } from './currency-registry.service';
import { ExchangeRateSnapshotService } from './exchange-rate-snapshot.service';
import { MoneyArithmeticService } from './money-arithmetic.service';
import { MonetaryRoundingService } from './monetary-rounding.service';

export interface ConversionResult {
  conversionRequestId: string;
  sourceMoney: MoneyValue;
  targetMoney: MoneyValue;
  unroundedTargetValue: string;
  exchangeRateSnapshotId: string;
  roundingPolicyId: string;
  conversionTraceId: string;
}

export class CurrencyConversionService {
  private static traceStore: Map<string, any> = new Map();

  public static convertMoney(
    request: CurrencyConversionRequest
  ): ConversionResult {
    const srcCode = request.sourceMoney.currencyCode.toUpperCase();
    const tgtCode = request.targetCurrencyCode.toUpperCase();
    const valuationDate = request.valuationDate || new Date().toISOString().split('T')[0];

    // Step 1: Validate currencies
    CurrencyRegistryService.validateCurrencyForCalculation(srcCode, 'MIRATH');
    CurrencyRegistryService.validateCurrencyForCalculation(tgtCode, 'MIRATH');

    // Step 2: Identity conversion (same currency)
    if (srcCode === tgtCode) {
      const snap = ExchangeRateSnapshotService.findApprovedSnapshot(srcCode, tgtCode, valuationDate)!;
      const traceId = `TRACE-${crypto.randomUUID()}`;
      return {
        conversionRequestId: request.conversionRequestId,
        sourceMoney: request.sourceMoney,
        targetMoney: request.sourceMoney,
        unroundedTargetValue: request.sourceMoney.decimalAmount,
        exchangeRateSnapshotId: snap.exchangeRateSnapshotId,
        roundingPolicyId: 'MONEY-ROUNDING-STANDARD-001',
        conversionTraceId: traceId,
      };
    }

    // Step 3: Retrieve or create approved rate snapshot
    let snapshot = ExchangeRateSnapshotService.findApprovedSnapshot(srcCode, tgtCode, valuationDate);

    if (!snapshot) {
      // Return unapproved/mock rate for testing or throw EXCHANGE_RATE_UNAVAILABLE if strict
      const missingResponse: MissingRateResponse = {
        status: 'EXCHANGE_RATE_UNAVAILABLE',
        sourceCurrencyCode: srcCode,
        targetCurrencyCode: tgtCode,
        valuationDate,
        requiresUserAction: true,
        reviewRequired: true,
        message: `No approved exchange rate available for pair ${srcCode}/${tgtCode} on date ${valuationDate}`,
      };
      const err = new Error(missingResponse.message);
      (err as any).missingResponse = missingResponse;
      (err as any).statusCode = 422;
      throw err;
    }

    // Step 4: Perform exact decimal multiplication
    const { unroundedDecimal } = MoneyArithmeticService.multiplyByRate(
      request.sourceMoney,
      snapshot.rate.value,
      tgtCode
    );

    // Step 5: Apply approved monetary rounding
    const roundingRes = MonetaryRoundingService.applyRounding(unroundedDecimal, tgtCode);

    // Step 6: Log trace
    const traceId = `TRACE-${crypto.randomUUID()}`;
    const traceSteps = [
      { sequence: 1, action: 'VALIDATE_CURRENCIES', result: 'VALID', timestamp: new Date().toISOString() },
      { sequence: 2, action: 'RESOLVE_VALUATION_DATE', result: valuationDate, timestamp: new Date().toISOString() },
      { sequence: 3, action: 'LOAD_EXCHANGE_RATE', exchangeRateSnapshotId: snapshot.exchangeRateSnapshotId, result: snapshot.rate.value, timestamp: new Date().toISOString() },
      { sequence: 4, action: 'CONVERT_EXACT_DECIMAL', result: unroundedDecimal, timestamp: new Date().toISOString() },
      { sequence: 5, action: 'APPLY_ROUNDING', roundingPolicyId: roundingRes.policyId, result: roundingRes.roundedMoney.decimalAmount, timestamp: new Date().toISOString() },
    ];

    const traceChecksum = crypto.createHash('sha256').update(JSON.stringify(traceSteps)).digest('hex');

    this.traceStore.set(traceId, {
      traceId,
      conversionRequestId: request.conversionRequestId,
      steps: traceSteps,
      checksum: traceChecksum,
    });

    return {
      conversionRequestId: request.conversionRequestId,
      sourceMoney: request.sourceMoney,
      targetMoney: roundingRes.roundedMoney,
      unroundedTargetValue: unroundedDecimal,
      exchangeRateSnapshotId: snapshot.exchangeRateSnapshotId,
      roundingPolicyId: roundingRes.policyId,
      conversionTraceId: traceId,
    };
  }
}
