/**
 * MIZAN CLI — Agriculture Facts Validator Script (Phase 10)
 *
 * Usage: npx ts-node scripts/agriculture/validate-agriculture-facts.ts
 */

import { CanonicalAgricultureFactsSchema } from '../../../packages/shared/src';

const testFact = {
  assetInstanceId: 'AGRI-TEST-001',
  categoryId: 'AGRICULTURAL_PRODUCE',
  produceTypeId: 'WHEAT',
  harvest: {
    harvestDate: '2026-08-01',
    produceTypeId: 'WHEAT',
    quantity: { numerator: 10n, denominator: 1n },
    quantityUnit: 'WASQ',
  },
  irrigation: {
    method: 'RAIN_FED',
    irrigationCostBorne: false,
  },
  ownership: {
    ownershipStartDate: '2026-01-01',
    isFullOwner: true,
  },
};

console.log('[MIZAN CLI] Validating Agriculture Facts schema...');
const result = CanonicalAgricultureFactsSchema.safeParse(testFact);

if (result.success) {
  console.log('[MIZAN CLI] ✅ Agriculture Facts validation PASSED.');
  process.exit(0);
} else {
  console.error('[MIZAN CLI] ❌ Agriculture Facts validation FAILED:', result.error);
  process.exit(1);
}
