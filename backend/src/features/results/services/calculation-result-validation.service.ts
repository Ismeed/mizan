/**
 * MIZAN — Calculation Result Validation Service (Phase 13)
 * Validates envelope structure, decision payloads, and cross-field invariant rules.
 */

import type { CalculationResultEnvelope, ResultItem } from '@mizan/shared';
import { ResultIntegrityService } from './result-integrity.service';

export interface ResultValidationError {
  fieldPath: string;
  errorCode: string;
  message: string;
}

export class CalculationResultValidationService {
  static validateEnvelope(envelope: CalculationResultEnvelope): {
    isValid: boolean;
    errors: ResultValidationError[];
  } {
    const errors: ResultValidationError[] = [];

    if (!envelope.resultId) {
      errors.push({ fieldPath: 'resultId', errorCode: 'MISSING_RESULT_ID', message: 'Result ID is required' });
    }
    if (!envelope.calculationId) {
      errors.push({ fieldPath: 'calculationId', errorCode: 'MISSING_CALCULATION_ID', message: 'Calculation ID is required' });
    }
    if (!envelope.profile || !envelope.profile.madhhab) {
      errors.push({ fieldPath: 'profile.madhhab', errorCode: 'MISSING_PROFILE_MADHHAB', message: 'Profile madhhab is required' });
    }

    // Cross-field validation 1: Blocked heir must not receive positive share or monetary allocation
    envelope.resultItems.forEach((item: ResultItem, idx: number) => {
      if (item.status === 'BLOCKED') {
        const hasPositiveMoney = item.monetaryValues.some(
          (m) => m.money.amountMinor && Number(m.money.amountMinor) > 0
        );
        if (hasPositiveMoney) {
          errors.push({
            fieldPath: `resultItems[${idx}].monetaryValues`,
            errorCode: 'BLOCKED_HEIR_POSITIVE_ALLOCATION',
            message: `Blocked heir ${item.subject.subjectId} cannot receive a positive monetary allocation`,
          });
        }
      }

      if (item.itemType === 'HIJAB_RESULT') {
        if (!item.decision || !item.decision.authoritativePayload) {
          errors.push({
            fieldPath: `resultItems[${idx}].decision.authoritativePayload`,
            errorCode: 'MISSING_AUTHORITATIVE_PAYLOAD',
            message: 'Hijab result item requires authoritative payload',
          });
        }
      }
    });

    // Checksum validation
    const { integrity, ...coreEnvelope } = envelope;
    if (integrity && integrity.resultChecksum) {
      const recomputed = ResultIntegrityService.generateChecksum(coreEnvelope);
      if (recomputed !== integrity.resultChecksum) {
        errors.push({
          fieldPath: 'integrity.resultChecksum',
          errorCode: 'RESULT_CHECKSUM_MISMATCH',
          message: 'Result checksum verification failed',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
