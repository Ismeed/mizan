/**
 * AI Result Context Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { AIResultContextService } from '../../features/results/services/ai-result-context.service';
import type { CalculationResultEnvelope } from '@mizan/shared';

describe('AI Result Context Tests', () => {
  it('should package AIResultContextPackage with all 10 strict AI restrictions', () => {
    const mockEnvelope: Partial<CalculationResultEnvelope> = {
      calculationId: 'calc_ai_1',
      resultId: 'res_ai_1',
      module: 'MIRATH',
      status: 'COMPLETED',
      profile: {
        madhhab: 'HANAFI',
        language: { languageTag: 'en', locale: 'en-US', direction: 'LTR' },
      } as any,
      context: { knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0' } as any,
      resultItems: [
        {
          resultItemId: 'item_ai_1',
          itemType: 'FIXED_SHARE_RESULT',
          subject: { subjectId: 'WIFE' },
          status: 'SHARE_ASSIGNED',
          decision: { decisionCode: 'MIRATH_FIXED_SHARE_ASSIGNED' },
          exactValues: { fractions: [{ numerator: 1, denominator: 8 }] },
          monetaryValues: [],
          ruleResolution: { appliedRules: [] },
          evidence: [],
          explanations: [],
        } as any,
      ],
    };

    const packaged = AIResultContextService.packageResultContext(mockEnvelope as CalculationResultEnvelope, 'item_ai_1');

    expect(packaged.task).toBe('EXPLAIN_CALCULATION_RESULT');
    expect(packaged.restrictions.mustNotRecalculate).toBe(true);
    expect(packaged.restrictions.mustNotChangeResult).toBe(true);
    expect(packaged.restrictions.mustNotChangeMadhhab).toBe(true);
    expect(packaged.restrictions.mustNotInventRule).toBe(true);
    expect(packaged.restrictions.mustNotInventEvidence).toBe(true);
    expect(packaged.restrictions.mustNotInventFraction).toBe(true);
    expect(packaged.restrictions.mustNotInventRate).toBe(true);
    expect(packaged.restrictions.mustNotModifyMoney).toBe(true);
    expect(packaged.restrictions.mustUseProvidedResultContract).toBe(true);
    expect(packaged.restrictions.mustDiscloseInsufficientContext).toBe(true);
  });
});
