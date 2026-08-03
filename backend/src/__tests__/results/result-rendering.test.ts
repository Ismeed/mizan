/**
 * Result Rendering Test Suite
 * Phase 13 — MIZAN Standard Calculation Result Contract
 */

import { ResultRenderingService } from '../../features/results/services/result-rendering.service';
import type { CalculationResultEnvelope } from '@mizan/shared';

describe('Result Rendering Tests', () => {
  it('should format money values and subjects without mutating authoritative envelope fields', () => {
    const mockEnvelope: Partial<CalculationResultEnvelope> = {
      resultId: 'res_render_1',
      calculationId: 'calc_render_1',
      module: 'MIRATH',
      resultItems: [
        {
          resultItemId: 'item_ren_1',
          itemType: 'FIXED_SHARE_RESULT',
          subject: { subjectId: 'HUSBAND', subjectType: 'HEIR', subjectVersion: '1.0.0', instanceId: 'inst_1' },
          status: 'SHARE_ASSIGNED',
          decision: { decisionCode: 'MIRATH_FIXED_SHARE_ASSIGNED', decisionType: 'SHARE', authoritativePayload: {} },
          exactValues: { fractions: [{ valueId: 'SHARE', numerator: 1, denominator: 4 }], rates: [], quantities: [], counts: [] },
          monetaryValues: [
            {
              valueId: 'ALLOCATION_1',
              role: 'FINAL_RESULT',
              money: {
                currencyCode: 'USD',
                value: { representationType: 'MINOR_UNITS', amountMinor: '25000000' },
              },
            },
          ],
          evidence: [],
          explanations: [],
        } as any,
      ],
    };

    const rendered = ResultRenderingService.renderResult(mockEnvelope as CalculationResultEnvelope, 'ha', 'ha-NG', 'LTR');

    expect(rendered.authoritativeResultId).toBe('res_render_1');
    expect(rendered.language.languageTag).toBe('ha');
    expect(rendered.localizedSubjects.HUSBAND.localizedName).toBe('HUSBAND');
    expect(rendered.formattedValues.ALLOCATION_1.formattedString).toBeDefined();
    expect(rendered.renderedChecksum).toBeDefined();
  });
});
