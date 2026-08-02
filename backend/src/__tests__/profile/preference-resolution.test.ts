import { CalculationProfileResolverService } from '../../features/profile/services/calculation-profile-resolver.service';
import { UserPreferenceService } from '../../features/profile/services/user-preference.service';

jest.mock('../../features/profile/services/user-preference.service');

describe('Calculation Profile Resolution - Priority & Source Attribution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (UserPreferenceService.getOrCreate as jest.Mock).mockResolvedValue({
      user_id: 'usr_test_123',
      preferred_madhhab: 'MALIKI',
      preferred_currency: 'NGN',
      preferred_language: 'en',
      preferred_locale: 'en-NG',
      country_code: 'NG',
      timezone: 'Africa/Lagos',
    });
  });

  test('Calculation override takes precedence over user profile preferences', async () => {
    const res = await CalculationProfileResolverService.resolveProfile({
      userId: 'usr_test_123',
      module: 'MIRATH',
      calculationOverrides: {
        madhhab: 'HANAFI',
        currency: 'USD',
      },
    });

    expect(res.profile.preferences.madhhab.resolved).toBe('HANAFI');
    expect(res.profile.preferences.madhhab.source).toBe('CALCULATION_OVERRIDE');
    expect(res.profile.preferences.currency.code).toBe('USD');
    expect(res.profile.preferences.currency.source).toBe('CALCULATION_OVERRIDE');
  });

  test('User profile preferences are used when no calculation override is specified', async () => {
    const res = await CalculationProfileResolverService.resolveProfile({
      userId: 'usr_test_123',
      module: 'ZAKAT',
    });

    expect(res.profile.preferences.madhhab.resolved).toBe('MALIKI');
    expect(res.profile.preferences.madhhab.source).toBe('USER_PROFILE');
    expect(res.profile.preferences.currency.code).toBe('NGN');
    expect(res.profile.preferences.currency.source).toBe('USER_PROFILE');
  });

  test('Falls back to user profile currency and issues warning when requested override is unsupported', async () => {
    const res = await CalculationProfileResolverService.resolveProfile({
      userId: 'usr_test_123',
      module: 'MIRATH',
      calculationOverrides: {
        currency: 'INVALID_XYZ',
      },
    });

    expect(res.profile.preferences.currency.code).toBe('NGN');
    expect(res.profile.preferences.currency.source).toBe('USER_PROFILE');
    expect(res.warnings.length).toBeGreaterThan(0);
    expect(res.warnings[0]).toContain('unsupported');
  });

  test('System default fallback is applied when both user profile and override currencies are invalid', async () => {
    (UserPreferenceService.getOrCreate as jest.Mock).mockResolvedValue({
      user_id: 'usr_test_123',
      preferred_madhhab: 'MALIKI',
      preferred_currency: 'CORRUPTED_CODE',
      preferred_language: 'en',
      preferred_locale: 'en-NG',
      country_code: 'NG',
      timezone: 'Africa/Lagos',
    });

    const res = await CalculationProfileResolverService.resolveProfile({
      userId: 'usr_test_123',
      module: 'MIRATH',
    });

    expect(res.profile.preferences.currency.code).toBe('NGN');
    expect(res.profile.preferences.currency.source).toBe('SYSTEM_DEFAULT');
    expect(res.warnings.length).toBeGreaterThan(0);
    expect(res.warnings[0]).toContain('unsupported');
  });
});
