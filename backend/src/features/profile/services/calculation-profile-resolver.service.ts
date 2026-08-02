import { 
  CalculationProfile, 
  ProfileResolutionRequest, 
  ProfileResolutionResult, 
  MadhhabCode, 
  PreferenceSource 
} from '@mizan/shared';
import { UserPreferenceService } from './user-preference.service';
import { MadhhabRegistryService } from '../registries/madhhab.registry';
import { CurrencyRegistryService } from '../registries/currency.registry';
import { LanguageRegistryService } from '../registries/language.registry';
import { ProfileChecksumService } from './profile-checksum.service';
import crypto from 'crypto';

export class CalculationProfileResolverService {
  /**
   * Deterministically resolves effective preferences for a calculation.
   * Priority:
   *  1. Explicit calculation-level override
   *  2. Saved user preference
   *  3. Approved system default
   */
  static async resolveProfile(request: ProfileResolutionRequest): Promise<ProfileResolutionResult> {
    const warnings: string[] = [];

    // 1. Fetch user preferences (or defaults)
    const userPref = await UserPreferenceService.getOrCreate(request.userId);

    // ── MADHHAB RESOLUTION ──────────────────────────────────────────────────
    let selectedMadhhab: MadhhabCode = userPref.preferred_madhhab as MadhhabCode;
    let resolvedMadhhab: MadhhabCode = selectedMadhhab;
    let madhhabSource: PreferenceSource = 'USER_PROFILE';
    let madhhabFallbackApplied = false;

    if (request.calculationOverrides?.madhhab) {
      const overrideVal = request.calculationOverrides.madhhab.toUpperCase() as MadhhabCode;
      if (MadhhabRegistryService.isSupported(overrideVal)) {
        selectedMadhhab = overrideVal;
        resolvedMadhhab = overrideVal;
        madhhabSource = 'CALCULATION_OVERRIDE';
      } else {
        warnings.push(`Requested Madhhab override '${request.calculationOverrides.madhhab}' is unsupported. Falling back to user profile Madhhab '${userPref.preferred_madhhab}'.`);
      }
    }

    if (!MadhhabRegistryService.isSupported(resolvedMadhhab)) {
      resolvedMadhhab = 'MALIKI';
      madhhabSource = 'SYSTEM_DEFAULT';
      madhhabFallbackApplied = true;
      warnings.push(`User Madhhab '${userPref.preferred_madhhab}' is inactive/unsupported. Applied system default 'MALIKI'.`);
    }

    // ── CURRENCY RESOLUTION ─────────────────────────────────────────────────
    let selectedCurrency = userPref.preferred_currency;
    let currencySource: PreferenceSource = 'USER_PROFILE';
    let currencyFallbackApplied = false;

    if (request.calculationOverrides?.currency) {
      const overrideVal = request.calculationOverrides.currency.toUpperCase();
      if (CurrencyRegistryService.isSupported(overrideVal)) {
        selectedCurrency = overrideVal;
        currencySource = 'CALCULATION_OVERRIDE';
      } else {
        warnings.push(`Requested currency override '${request.calculationOverrides.currency}' is unsupported. Falling back to user profile currency '${userPref.preferred_currency}'.`);
      }
    }

    let currencyDef = CurrencyRegistryService.get(selectedCurrency);
    if (!currencyDef) {
      currencyDef = CurrencyRegistryService.get('NGN')!;
      currencySource = 'SYSTEM_DEFAULT';
      currencyFallbackApplied = true;
      warnings.push(`Currency '${selectedCurrency}' is unsupported. Applied system default 'NGN'.`);
    }

    // ── LANGUAGE RESOLUTION ─────────────────────────────────────────────────
    let selectedLanguage = userPref.preferred_language;
    let languageSource: PreferenceSource = 'USER_PROFILE';
    let languageFallbackApplied = false;

    if (request.calculationOverrides?.language) {
      const overrideVal = request.calculationOverrides.language.toLowerCase();
      if (LanguageRegistryService.isSupported(overrideVal)) {
        selectedLanguage = overrideVal;
        languageSource = 'CALCULATION_OVERRIDE';
      } else {
        warnings.push(`Requested language override '${request.calculationOverrides.language}' is unsupported. Falling back to user profile language '${userPref.preferred_language}'.`);
      }
    }

    let langDef = LanguageRegistryService.get(selectedLanguage);
    if (!langDef) {
      langDef = LanguageRegistryService.get('en')!;
      languageSource = 'SYSTEM_DEFAULT';
      languageFallbackApplied = true;
      warnings.push(`Language '${selectedLanguage}' is unsupported. Applied system default 'en'.`);
    }

    // ── REGION RESOLUTION ───────────────────────────────────────────────────
    let countryCode = request.calculationOverrides?.region?.countryCode || userPref.country_code || 'NG';
    let timezone = request.calculationOverrides?.region?.timezone || userPref.timezone || 'Africa/Lagos';
    let regionSource: PreferenceSource = request.calculationOverrides?.region ? 'CALCULATION_OVERRIDE' : 'USER_PROFILE';

    // Optionally save overrides as user default if requested
    if (request.saveAsDefault && request.calculationOverrides) {
      await UserPreferenceService.update(request.userId, {
        preferredMadhhab: request.calculationOverrides.madhhab,
        preferredCurrency: request.calculationOverrides.currency,
        preferredLanguage: request.calculationOverrides.language,
        countryCode: request.calculationOverrides.region?.countryCode,
        timezone: request.calculationOverrides.region?.timezone,
      });
    }

    const now = new Date().toISOString();

    const profilePayload: CalculationProfile = {
      calculationProfileId: `cp_${crypto.randomUUID().replace(/-/g, '')}`,
      userId: request.userId,
      module: request.module,
      preferences: {
        madhhab: {
          selected: selectedMadhhab,
          resolved: resolvedMadhhab,
          source: madhhabSource,
          fallbackApplied: madhhabFallbackApplied,
        },
        currency: {
          code: currencyDef.code,
          symbol: currencyDef.symbol,
          decimalPlaces: currencyDef.decimalPlaces,
          locale: currencyDef.defaultLocale,
          source: currencySource,
          fallbackApplied: currencyFallbackApplied,
        },
        language: {
          tag: langDef.tag,
          locale: langDef.locale,
          direction: langDef.direction,
          source: languageSource,
          fallbackApplied: languageFallbackApplied,
        },
        region: {
          countryCode,
          timezone,
          source: regionSource,
        },
      },
      versions: {
        profileSchemaVersion: '1.0.0',
        ruleEngineVersion: '1.0.0',
        knowledgeReleaseVersion: '1.0.0',
        reportSchemaVersion: '1.0.0',
      },
      createdAt: now,
      isImmutable: false,
      profileStatus: 'ACTIVE',
    };

    profilePayload.checksum = ProfileChecksumService.generateChecksum(profilePayload);

    return {
      profile: profilePayload,
      warnings,
    };
  }
}
