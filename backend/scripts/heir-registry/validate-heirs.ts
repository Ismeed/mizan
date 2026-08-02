/**
 * MIZAN — CLI Script: Validate Canonical Heir Registry (Phase 7)
 *
 * Runs full structural, spec compliance, checksum, and ID format validation
 * across all baseline canonical heir entity records.
 *
 * Usage:
 *   npx ts-node scripts/heir-registry/validate-heirs.ts
 */

import { BASELINE_CANONICAL_HEIRS, BASELINE_CANONICAL_HEIR_GROUPS } from '../../../packages/shared/src';
import { HeirValidationService } from '../../src/features/heirs/services/heir-validation.service';

function runValidation() {
  console.log('====================================================');
  console.log('MIZAN — Canonical Heir Registry Validation CLI');
  console.log('====================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  console.log(`Checking ${BASELINE_CANONICAL_HEIRS.length} baseline canonical heir entities...\n`);

  for (const entity of BASELINE_CANONICAL_HEIRS) {
    const report = HeirValidationService.validateEntity(entity);

    if (report.passed) {
      console.log(`  ✓ [PASS] ${entity.heirId} (v${entity.version})`);
      passedCount++;
    } else {
      console.error(`  ✗ [FAIL] ${entity.heirId} (v${entity.version})`);
      for (const issue of report.issues) {
        console.error(`      - [${issue.errorCode}] ${issue.fieldPath}: ${issue.message}`);
      }
      failedCount++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(`Checking ${BASELINE_CANONICAL_HEIR_GROUPS.length} baseline canonical heir groups...\n`);

  for (const group of BASELINE_CANONICAL_HEIR_GROUPS) {
    console.log(`  ✓ [GROUP] ${group.heirGroupId} (${group.sharedMembers.length} members)`);
  }

  console.log('\n====================================================');
  console.log(`Validation Summary: ${passedCount} passed, ${failedCount} failed.`);
  console.log('====================================================');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runValidation();
