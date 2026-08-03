/**
 * Exchange Rate Provider Service
 * Phase 12 — MIZAN Currency Architecture
 */

import { ExchangeRateProvider } from '@mizan/shared';

export const BASELINE_PROVIDERS: ExchangeRateProvider[] = [
  {
    providerId: 'CENTRAL_BANK_NIGERIA',
    version: '1.0.0',
    name: 'Central Bank of Nigeria Official Exchange Rates',
    providerType: 'CENTRAL_BANK',
    supportedCurrencies: ['NGN', 'USD', 'EUR', 'GBP'],
    historicalRatesSupported: true,
    licenceStatus: 'OFFICIAL_GOVERNMENT_SOURCE',
    availabilityStatus: 'ACTIVE',
    reliabilityPolicy: {
      maximumRateAgeHours: 24,
      fallbackAllowed: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
  },
  {
    providerId: 'ECB_OFFICIAL_RATES',
    version: '1.0.0',
    name: 'European Central Bank Reference Rates',
    providerType: 'CENTRAL_BANK',
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'SAR'],
    historicalRatesSupported: true,
    licenceStatus: 'PUBLIC_DOMAIN_OFFICIAL',
    availabilityStatus: 'ACTIVE',
    reliabilityPolicy: {
      maximumRateAgeHours: 24,
      fallbackAllowed: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
  },
];

export class ExchangeRateProviderService {
  private static providerMap: Map<string, ExchangeRateProvider> = new Map();

  static {
    for (const p of BASELINE_PROVIDERS) {
      this.providerMap.set(p.providerId, p);
    }
  }

  public static getProvider(providerId: string): ExchangeRateProvider | null {
    return this.providerMap.get(providerId) || null;
  }

  public static isProviderActive(providerId: string): boolean {
    const p = this.getProvider(providerId);
    return !!p && p.availabilityStatus === 'ACTIVE' && p.governance.status === 'APPROVED';
  }
}
