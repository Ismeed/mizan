import {
  ALL_EVIDENCE_NAVIGATION_ACTIONS,
  ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES,
  EvidenceSupportsCategory,
} from '../../../packages/shared/src';
import { EvidenceNavigationBuilderService } from '../../src/features/evidence-navigation/services/evidence-navigation-builder.service';
import { EvidenceNavigationValidationService } from '../../src/features/evidence-navigation/services/evidence-navigation-validation.service';

function main() {
  console.log('====================================================');
  console.log('MIZAN Evidence Navigation — Payload Validation CLI');
  console.log('====================================================\n');

  console.log(`[OK] Permanent Navigation Actions registered: ${ALL_EVIDENCE_NAVIGATION_ACTIONS.length}`);
  console.log(`[OK] Permanent Origin Types registered: ${ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES.length}\n`);

  // Test building and validating Standalone Payload
  const standalone = EvidenceNavigationBuilderService.buildStandalonePayload({
    evidenceId: 'TEST-QURAN-004-011',
    evidenceVersion: '1.0.0',
    evidenceType: 'QURAN',
    selectedMadhhab: 'MALIKI',
    languageTag: 'en',
  });

  const v1 = EvidenceNavigationValidationService.validatePayload(standalone);
  if (!v1.isValid) {
    console.error('[FAIL] Standalone payload validation failed:', v1.message);
    process.exit(1);
  }
  console.log('[PASS] Standalone Payload Validation: VALID');

  // Test building and validating Result Item Payload
  const resultPayload = EvidenceNavigationBuilderService.buildResultItemPayload({
    calculationId: 'CALC-TEST-001',
    calculationProfileId: 'PROF-TEST-001',
    resultId: 'RES-TEST-001',
    resultSnapshotId: 'SNAP-TEST-001',
    resultItemId: 'ITEM-TEST-001',
    subjectType: 'HEIR',
    subjectId: 'DAUGHTER',
    ruleId: 'MIRATH-FIXED-DAUGHTER-SINGLE',
    ruleVersion: '1.0.0',
    evidenceId: 'TEST-QURAN-004-011',
    evidenceVersion: '1.0.0',
    resultEvidenceLinkId: 'LINK-TEST-001',
    supports: EvidenceSupportsCategory.FRACTION,
    selectedMadhhab: 'MALIKI',
    languageTag: 'en',
  });

  const v2 = EvidenceNavigationValidationService.validatePayload(resultPayload);
  if (!v2.isValid) {
    console.error('[FAIL] Result Item payload validation failed:', v2.message);
    process.exit(1);
  }
  console.log('[PASS] Result Item Payload Validation: VALID');

  console.log('\n✅ All evidence navigation payload validation tests passed successfully!');
}

main();
