import { AIProfileContextService } from '../../features/profile/services/ai-profile-context.service';
import { ReportProfileService } from '../../features/profile/services/report-profile.service';
import { CalculationProfileSnapshotService } from '../../features/profile/services/calculation-profile-snapshot.service';

jest.mock('../../features/profile/services/calculation-profile-snapshot.service');

describe('Profile System Integration - AI Assistant & Report Section Injection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (CalculationProfileSnapshotService.getSnapshotByCalculationId as jest.Mock).mockResolvedValue({
      calculation_id: 'calc_test_999',
      module: 'MIRATH',
      madhhab: 'MALIKI',
      madhhab_source: 'USER_PROFILE',
      currency_code: 'NGN',
      currency_symbol_snapshot: '₦',
      currency_decimal_places_snapshot: 2,
      currency_locale_snapshot: 'en-NG',
      currency_source: 'USER_PROFILE',
      language_tag: 'en',
      locale: 'en-US',
      text_direction: 'LTR',
      language_source: 'USER_PROFILE',
      country_code: 'NG',
      timezone: 'Africa/Lagos',
      region_source: 'USER_PROFILE',
      profile_schema_version: '1.0.0',
      rule_engine_version: '1.0.0',
      knowledge_release_version: '1.0.0',
      report_schema_version: '1.0.0',
      checksum: 'fake_checksum_hash',
      profile_status: 'FROZEN',
      created_at: new Date(),
    });

    (CalculationProfileSnapshotService.verifySnapshotIntegrity as jest.Mock).mockResolvedValue(true);
  });

  test('Builds restricted AI context containing frozen calculation profile', async () => {
    const aiCtx = await AIProfileContextService.buildAIContext('calc_test_999');

    expect(aiCtx).not.toBeNull();
    expect(aiCtx?.calculationProfile.madhhab).toBe('MALIKI');
    expect(aiCtx?.calculationProfile.currencyCode).toBe('NGN');
    expect(aiCtx?.restrictions.mustNotChangeMadhhab).toBe(true);
    expect(aiCtx?.restrictions.mustNotRecalculate).toBe(true);
  });

  test('Constructs report profile metadata section for PDF injection', async () => {
    const reportProfile = await ReportProfileService.getReportProfileSection('calc_test_999');

    expect(reportProfile).toBeDefined();
    expect(reportProfile.madhhabCode).toBe('MALIKI');
    expect(reportProfile.madhhabName).toBe('Maliki School');
    expect(reportProfile.currencyCode).toBe('NGN');
    expect(reportProfile.profileStatus).toBe('FROZEN');
  });
});
