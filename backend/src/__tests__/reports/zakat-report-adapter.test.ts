/**
 * Zakat Report Adapter Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { ZakatReportSectionAdapter } from '../../features/reports/services/zakat-report-section.adapter';
import { CalculationResultAssemblerService } from '../../features/results/services/calculation-result-assembler.service';

describe('Zakat Report Adapter Tests', () => {
  it('should map Zakat calculation envelope items into standard section content', () => {
    const mockProfile: any = {
      calculationProfileId: 'prof_z_adp',
      userId: 'u_z_adp',
      module: 'ZAKAT',
      preferences: {
        madhhab: { selected: 'MALIKI', resolved: 'MALIKI', source: 'USER_PROFILE' },
        language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
        currency: { code: 'USD', symbol: '$', decimalPlaces: 2, locale: 'en-US', source: 'USER_PROFILE' },
        region: { countryCode: 'US', timezone: 'UTC', source: 'USER_PROFILE' },
      },
      versions: { profileSchemaVersion: '1.0.0', knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0', reportSchemaVersion: '1.0.0' },
      createdAt: new Date().toISOString(),
      isImmutable: true,
    };

    const envelope = CalculationResultAssemblerService.assembleEnvelope({
      calculationId: 'calc_z_adp',
      module: 'ZAKAT',
      profile: mockProfile,
      rawInput: { netZakatableWealth: 100000 },
      zakatResult: {
        isDue: true,
        hawlMet: true,
        totalZakatableWealth: 100000,
        totalLiabilities: 0,
        netZakatableWealth: 100000,
        nisabThreshold: 10000,
        zakatDue: 2500,
        zakatRate: 0.025,
        breakdown: [{ name: 'Cash', value: 100000, isZakatable: true }],
      },
    });

    const adapted = ZakatReportSectionAdapter.adaptSections(envelope);

    expect(adapted.REPORT_IDENTITY.module).toBe('ZAKAT');
    expect(adapted.DETAILED_BREAKDOWN.monetaryObligations.length).toBeGreaterThan(0);
    expect(adapted.DECLARATION_AND_CLOSING.madhhabNotice).toContain('MALIKI');
  });
});
