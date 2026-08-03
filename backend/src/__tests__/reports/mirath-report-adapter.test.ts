/**
 * Mirath Report Adapter Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { MirathReportSectionAdapter } from '../../features/reports/services/mirath-report-section.adapter';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('Mirath Report Adapter Tests', () => {
  it('should map Mirath calculation envelope items into standard section content', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_m_adp',
      userId: 'u_m_adp',
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

    const envelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_m_adp',
      module: 'MIRATH',
      profile: mockProfile,
      rawInput: { netEstate: 100000 },
      mirathResult: {
        netEstate: 100000,
        shares: [
          {
            key: 'wives',
            label: 'Wife',
            count: 1,
            shareType: 'FARD',
            fractionLabel: '1/4',
            fractionNumerator: 1,
            fractionDenominator: 4,
            shareOfEstate: 0.25,
            totalAmount: 25000,
            perPersonAmount: 25000,
            isBlocked: false,
          },
        ],
        totalAllocated: 25000,
        unallocated: 75000,
        calculationMethod: 'NORMAL',
        madhhab: 'HANAFI',
      },
    });

    const adapted = MirathReportSectionAdapter.adaptSections(envelope);

    expect(adapted.REPORT_IDENTITY.module).toBe('MIRATH');
    expect(adapted.DETAILED_BREAKDOWN.heirDistribution.length).toBeGreaterThan(0);
    expect(adapted.DECLARATION_AND_CLOSING.madhhabNotice).toContain('HANAFI');
  });
});
