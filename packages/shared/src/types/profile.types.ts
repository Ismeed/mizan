export type MadhhabCode = 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI';
export type CalcModule = 'MIRATH' | 'ZAKAT';
export type PreferenceSource = 'USER_PROFILE' | 'CALCULATION_OVERRIDE' | 'SYSTEM_DEFAULT' | 'MIGRATED_VALUE' | 'ADMINISTRATIVE_DEFAULT';
export type TextDirection = 'LTR' | 'RTL';

export interface PreferenceResolutionDetail<T> {
  selected: T;
  resolved: T;
  source: PreferenceSource;
  fallbackApplied?: boolean;
}

export interface CurrencyPreferenceDetail {
  code: string;
  symbol: string;
  decimalPlaces: number;
  locale: string;
  source: PreferenceSource;
  fallbackApplied?: boolean;
}

export interface LanguagePreferenceDetail {
  tag: string;
  locale: string;
  direction: TextDirection;
  source: PreferenceSource;
  fallbackApplied?: boolean;
}

export interface RegionPreferenceDetail {
  countryCode: string;
  timezone: string;
  source: PreferenceSource;
  fallbackApplied?: boolean;
}

export interface CalculationProfilePreferences {
  madhhab: PreferenceResolutionDetail<MadhhabCode>;
  currency: CurrencyPreferenceDetail;
  language: LanguagePreferenceDetail;
  region: RegionPreferenceDetail;
}

export interface ProfileVersions {
  profileSchemaVersion: string;
  ruleEngineVersion: string;
  knowledgeReleaseVersion: string;
  reportSchemaVersion: string;
}

export interface CalculationProfile {
  calculationProfileId: string;
  calculationId?: string;
  userId: string;
  module: CalcModule;
  preferences: CalculationProfilePreferences;
  versions: ProfileVersions;
  createdAt: string;
  frozenAt?: string;
  isImmutable: boolean;
  checksum?: string;
  profileStatus?: 'ACTIVE' | 'FROZEN' | 'INCOMPLETE_HISTORICAL_CONTEXT';
}

export interface ProfileResolutionRequest {
  userId: string;
  module: CalcModule;
  calculationOverrides?: {
    madhhab?: MadhhabCode;
    currency?: string;
    language?: string;
    region?: {
      countryCode?: string;
      timezone?: string;
    };
  };
  saveAsDefault?: boolean;
}

export interface ProfileResolutionResult {
  profile: CalculationProfile;
  warnings: string[];
}

export interface UnsupportedMadhhabResponse {
  status: 'UNSUPPORTED_FOR_SELECTED_MADHHAB';
  madhhab: MadhhabCode;
  topic: string;
  requiresScholarReview: boolean;
  details?: string;
}
