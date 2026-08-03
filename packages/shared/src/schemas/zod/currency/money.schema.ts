/**
 * MIZAN — Money Value Zod Schema (Phase 12)
 */

import { z } from 'zod';
import { CurrencyCodeSchema } from './currency-definition.schema';

export const MoneyValueSchema = z.object({
  currencyCode: CurrencyCodeSchema,
  representationType: z.enum(['MINOR_UNITS', 'ARBITRARY_PRECISION_DECIMAL']),
  amountMinor: z.string().regex(/^-?\d+$/, 'amountMinor must be an integer string representing minor units'),
  decimalAmount: z.string().regex(/^-?\d+(\.\d+)?$/, 'decimalAmount must be a valid decimal string'),
  minorUnitDigits: z.number().int().min(0).max(6),
});
