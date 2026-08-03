/**
 * AI Report Context Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { AIReportContextService } from '../../features/reports/services/ai-report-context.service';
import { ReportAssemblyService } from '../../features/reports/services/report-assembly.service';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('AI Report Context Tests', () => {
  it('should package report context for AI with 8 strict restrictions', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_ai_rep',
      userId: 'u_ai_rep',
      module: 'MIRATH',
      preferences: {
        madhhab: { selected: 'HANAFI', resolved: 'HANAFI', source: 'USER_PROFILE' },
        language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
        currency: { code: 'USD', symbol: '$', decimalPlaces: 2, locale: 'en-US', source: 'USER_PROFILE' },
        region: { countryCode: 'US', timezone: 'UTC', source: 'USER_PROFILE' },
      },
      versions: { profileSchemaVersion: '1.0.0', knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0', reportSchemaVersion: '1.0.0' },
      createdAt: new Date().toISOString(),
      isImmutable: true,
    };

    const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_ai_rep',
      module: 'MIRATH',
      profile: mockProfile,
      rawInput: { netEstate: 100000 },
      mirathResult: {
        netEstate: 100000,
        shares: [],
        totalAllocated: 0,
        unallocated: 100000,
        calculationMethod: 'NORMAL',
        madhhab: 'HANAFI',
      },
    });

    const report = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });
    const aiContext = AIReportContextService.buildReportAIContext(report);

    expect(aiContext.task).toBe('EXPLAIN_REPORT_SECTION');
    expect(aiContext.restrictions.mustNotRecalculate).toBe(true);
    expect(aiContext.restrictions.mustNotChangeReport).toBe(true);
    expect(aiContext.restrictions.mustNotChangeResult).toBe(true);
    expect(aiContext.restrictions.mustNotChangeMadhhab).toBe(true);
    expect(aiContext.restrictions.mustNotInventEvidence).toBe(true);
    expect(aiContext.restrictions.mustNotInventFraction).toBe(true);
    expect(aiContext.restrictions.mustNotInventRate).toBe(true);
    expect(aiContext.restrictions.mustNotPresentGeneratedTextAsSourceText).toBe(true);
  });
});
