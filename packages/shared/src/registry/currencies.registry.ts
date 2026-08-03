/**
 * MIZAN — Baseline Currency Registry (Phase 12)
 *
 * Governing baseline supported currencies with exact precision, localizations, and governance.
 */

import { CurrencyDefinition } from '../types/currency/currency-definition.types';

export const BASELINE_CURRENCY_REGISTRY: CurrencyDefinition[] = [
  {
    currencyCode: 'NGN',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '566',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'Nigerian Naira', plural: 'Nigerian Naira' },
      ha: { singular: 'Nairar Najeriya', plural: 'Nairar Najeriya' },
      ar: { singular: 'نيرة نيجيرية', plural: 'نيرات نيجيرية' },
    },
    symbolMetadata: {
      defaultSymbol: '₦',
      narrowSymbol: '₦',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['NG'],
      defaultLocale: 'en-NG',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'USD',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '840',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'US Dollar', plural: 'US Dollars' },
      ha: { singular: 'Dalar Amurka', plural: 'Dalar Amurka' },
      ar: { singular: 'دولار أمريكي', plural: 'دولارات أمريكية' },
    },
    symbolMetadata: {
      defaultSymbol: '$',
      narrowSymbol: '$',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['US'],
      defaultLocale: 'en-US',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'EUR',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '978',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'Euro', plural: 'Euros' },
      ha: { singular: 'Yuro', plural: 'Yuro' },
      ar: { singular: 'يورو', plural: 'يورو' },
    },
    symbolMetadata: {
      defaultSymbol: '€',
      narrowSymbol: '€',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['EU', 'DE', 'FR'],
      defaultLocale: 'en-GB',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'GBP',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '826',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'British Pound', plural: 'British Pounds' },
      ha: { singular: 'Fam din Birtaniya', plural: 'Fam din Birtaniya' },
      ar: { singular: 'جنيه إسترليني', plural: 'جنيهات إسترلينية' },
    },
    symbolMetadata: {
      defaultSymbol: '£',
      narrowSymbol: '£',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['GB'],
      defaultLocale: 'en-GB',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'SAR',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '682',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'Saudi Riyal', plural: 'Saudi Riyals' },
      ha: { singular: 'Riyal din Saudi', plural: 'Riyal din Saudi' },
      ar: { singular: 'ريال سعودي', plural: 'ريالات سعودية' },
    },
    symbolMetadata: {
      defaultSymbol: 'ر.س',
      narrowSymbol: 'ر.س',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['SA'],
      defaultLocale: 'ar-SA',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'AED',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '784',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'UAE Dirham', plural: 'UAE Dirhams' },
      ha: { singular: 'Dirham din UAE', plural: 'Dirham din UAE' },
      ar: { singular: 'درهم إماراتي', plural: 'دراهم إماراتية' },
    },
    symbolMetadata: {
      defaultSymbol: 'د.إ',
      narrowSymbol: 'د.إ',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['AE'],
      defaultLocale: 'ar-AE',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'GHS',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '936',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'Ghanaian Cedi', plural: 'Ghanaian Cedi' },
      ha: { singular: 'Cedi na Gana', plural: 'Cedi na Gana' },
      ar: { singular: 'سيدي غاني', plural: 'سيدي غاني' },
    },
    symbolMetadata: {
      defaultSymbol: 'GH₵',
      narrowSymbol: '₵',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['GH'],
      defaultLocale: 'en-GH',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  {
    currencyCode: 'KES',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    identity: {
      numericCode: '404',
      currencyType: 'FIAT',
    },
    names: {
      en: { singular: 'Kenyan Shilling', plural: 'Kenyan Shillings' },
      ha: { singular: 'Sillin na Kenya', plural: 'Sillin na Kenya' },
      ar: { singular: 'شيلينغ كيني', plural: 'شيلينغات كينية' },
    },
    symbolMetadata: {
      defaultSymbol: 'KSh',
      narrowSymbol: 'KSh',
      symbolPositionPolicy: 'LOCALE_CONTROLLED',
    },
    precision: {
      minorUnitDigits: 2,
      cashDigits: 2,
      accountingDigits: 2,
      supportsMinorUnits: true,
    },
    regionalMetadata: {
      primaryCountryCodes: ['KE'],
      defaultLocale: 'en-KE',
    },
    support: {
      inputEnabled: true,
      calculationEnabled: true,
      conversionEnabled: true,
      reportingEnabled: true,
    },
    governance: {
      status: 'APPROVED',
      effectiveFrom: '2026-01-01T00:00:00Z',
    },
    integrity: {
      contentChecksum: '2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
];
