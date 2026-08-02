/**
 * MIZAN — CLI Script: Migrate Legacy Labels to Canonical Heir IDs (Phase 7)
 *
 * Usage:
 *   npx ts-node scripts/heir-registry/migrate-legacy-labels.ts
 */

import { HeirMigrationService } from '../../src/features/heirs/services/heir-migration.service';

const LEGACY_SAMPLE_INPUTS = [
  'husband',
  'wives',
  'sons',
  'daughters',
  'father',
  'mother',
  'paternalGrandfathers',
  'paternalGrandmothers',
  'maternalGrandmothers',
  'fullBrothers',
  'fullSisters',
  'paternalHalfBrothers',
  'paternalHalfSisters',
  'maternalHalfSiblings',
  'sonsOfFullBrothers',
  'sonsOfPatHalfBrothers',
  'paternalUncles',
  'sonsOfPatUncles',
  'Husband',
  'Full Brother',
  'Ɗan’uwa na uwa da uba',
  'زوج',
  'Grandfather',
];

function runMigrationCLI() {
  console.log('====================================================');
  console.log('MIZAN — Legacy Label & Key Migration CLI');
  console.log('====================================================\n');

  const report = HeirMigrationService.migrateBatch(LEGACY_SAMPLE_INPUTS);

  console.log(`Processed ${report.totalProcessed} legacy values:\n`);

  for (const entry of report.entries) {
    if (entry.migrationStatus === 'VERIFIED') {
      console.log(`  ✓ [VERIFIED] "${entry.legacyValue}" ➔ ${entry.canonicalHeirId}`);
    } else if (entry.migrationStatus === 'REVIEW_REQUIRED') {
      console.log(`  ⚠ [REVIEW_REQUIRED] "${entry.legacyValue}" ➔ ${entry.canonicalHeirId} (${entry.note})`);
    } else {
      console.error(`  ✗ [UNRESOLVED] "${entry.legacyValue}" (${entry.note})`);
    }
  }

  console.log('\n====================================================');
  console.log(`Summary: ${report.verifiedCount} Verified, ${report.reviewRequiredCount} Review Required, ${report.unresolvedCount} Unresolved.`);
  console.log('====================================================');
}

runMigrationCLI();
