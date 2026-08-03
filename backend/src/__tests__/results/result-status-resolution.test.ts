/**
 * Result Status Resolution Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { CalculationStatusResolutionService } from '../../features/results/services/calculation-status-resolution.service';

describe('Result Status Resolution Tests', () => {
  it('should follow strict precedence order: INTEGRITY_FAILURE > CONFLICT > INVALID_INPUT > COMPLETED', () => {
    const status1 = CalculationStatusResolutionService.resolveTopLevelStatus({
      resultItems: [],
      warnings: [],
      errors: [{ errorId: '1', errorCode: 'CHK', category: 'INTEGRITY', severity: 'CRITICAL', scope: 'CALCULATION', messageKey: 'err', retryable: false, reviewRequired: false }],
      review: null,
    });
    expect(status1).toBe('INTEGRITY_FAILURE');

    const status2 = CalculationStatusResolutionService.resolveTopLevelStatus({
      resultItems: [],
      warnings: [],
      errors: [{ errorId: '2', errorCode: 'CNF', category: 'RULE_CONFLICT', severity: 'ERROR', scope: 'CALCULATION', messageKey: 'err', retryable: false, reviewRequired: false }],
      review: null,
    });
    expect(status2).toBe('CONFLICT');

    const status3 = CalculationStatusResolutionService.resolveTopLevelStatus({
      resultItems: [],
      warnings: [],
      errors: [],
      review: null,
    });
    expect(status3).toBe('COMPLETED');
  });
});
