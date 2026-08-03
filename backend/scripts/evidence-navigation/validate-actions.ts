import { ALL_EVIDENCE_NAVIGATION_ACTIONS, isValidEvidenceNavigationAction } from '../../../packages/shared/src';

const REQUIRED_ACTIONS = [
  'OPEN_AI_EVIDENCE',
  'OPEN_AI_RESULT_EVIDENCE',
  'OPEN_AI_RULE_EVIDENCE',
  'OPEN_AI_HIJAB_EVIDENCE',
  'OPEN_AI_MIRATH_SHARE_EVIDENCE',
  'OPEN_AI_ZAKAT_EVIDENCE',
  'OPEN_AI_NISAB_EVIDENCE',
  'OPEN_AI_LIVESTOCK_EVIDENCE',
  'OPEN_AI_AGRICULTURE_EVIDENCE',
  'OPEN_AI_REPORT_EVIDENCE',
  'OPEN_EVIDENCE_READER',
  'OPEN_RELATED_EXPLANATION',
  'OPEN_RELATED_RULE_DETAILS',
  'OPEN_COMPARATIVE_MADHHAB_EVIDENCE',
];

function main() {
  console.log('====================================================');
  console.log('MIZAN Evidence Navigation — Action Registry CLI');
  console.log('====================================================\n');

  let passed = true;
  for (const action of REQUIRED_ACTIONS) {
    if (isValidEvidenceNavigationAction(action)) {
      console.log(`[OK] Action registered: ${action}`);
    } else {
      console.error(`[FAIL] Required action missing: ${action}`);
      passed = false;
    }
  }

  // Verify arbitrary action rejection
  if (isValidEvidenceNavigationAction('OPEN_UNAPPROVED_CUSTOM_ACTION')) {
    console.error('[FAIL] Arbitrary action string was incorrectly accepted!');
    passed = false;
  } else {
    console.log('[PASS] Arbitrary action string correctly rejected.');
  }

  if (!passed) {
    process.exit(1);
  }

  console.log('\n✅ Permanent Action Registry validation passed (14/14 actions verified)!');
}

main();
