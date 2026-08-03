/**
 * MIZAN — Canonical Currency Definition Zod Schema (Phase 12)
 */

import { z } from 'zod';

export const CurrencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, 'Currency code must be a 3-letter uppercase ASCII ISO 4217 code');

export const LocalizedCurrencyNameSchema = z.object({
  singular: z.string().min(1),
  plural: z.string().min(1),
});

export const CurrencyPrecisionSchema = z.object({
  minorUnitDigits: z.number().int().min(0).max(6),
  cashDigits: z.number().int().min(0).max(6),
  accountingDigits: z.number().int().min(0).max(6),
  supportsMinorUnits: z.boolean(),
});

export const CurrencySymbolMetadataSchema = z.object({
  defaultSymbol: z.string().min(1),
  narrowSymbol: z.string().min(1),
  symbolPositionPolicy: z.enum(['BEFORE_AMOUNT', 'AFTER_AMOUNT', 'LOCALE_CONTROLLED']),
});

export const CurrencyRegionalMetadataSchema = z.object({
  primaryCountryCodes: z.array(z.string().length(2)),
  defaultLocale: z.string().min(2),
});

export const CurrencySupportSchema = z.object({
  inputEnabled: z.boolean(),
  calculationEnabled: z.boolean(),
  conversionEnabled: z.boolean(),
  reportingEnabled: z.boolean(),
});

export const CurrencyGovernanceSchema = z.object({
  status: z.enum([
    'DRAFT',
    'FINANCIAL_DATA_REVIEW',
    'TECHNICAL_VALIDATION',
    'APPROVED',
    'PRODUCTION',
    'DEPRECATED',
    'RETIRED',
  ]),
  effectiveFrom: z.string().nullable().optional(),
  effectiveUntil: z.string().nullable().optional(),
});

export const CurrencyIntegritySchema = z.object({
  contentChecksum: z.string().min(8),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CurrencyDefinitionSchema = z.object({
  currencyCode: CurrencyCodeSchema,
  version: z.string().min(1),
  schemaVersion: z.string().min(1),
  identity: z.object({
    numericCode: z.string().optional(),
    currencyType: z.enum(['FIAT', 'COMMODITY_LINKED', 'DIGITAL', 'INTERNAL_REFERENCE', 'OTHER_APPROVED_TYPE']),
  }),
  names: z.record(z.string(), LocalizedCurrencyNameSchema),
  symbolMetadata: CurrencySymbolMetadataSchema,
  precision: CurrencyPrecisionSchema,
  regionalMetadata: CurrencyRegionalMetadataSchema,
  support: CurrencySupportSchema,
  governance: CurrencyGovernanceSchema,
  integrity: CurrencyIntegritySchema,
});
