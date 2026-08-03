import {
  ALL_EVIDENCE_NAVIGATION_ACTIONS,
  ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES,
  getMandatoryAIRestrictions,
} from '../../../packages/shared/src';

function main() {
  console.log('================================================================');
  console.log('MIZAN Phase 15 — Master Release Validation Gate');
  console.log('================================================================\n');

  console.log('1. Checking Permanent Action Registry...');
  console.log(`   Registered actions count: ${ALL_EVIDENCE_NAVIGATION_ACTIONS.length} (Target: 14)`);
  if (ALL_EVIDENCE_NAVIGATION_ACTIONS.length !== 14) {
    console.error('   [FAIL] Expected 14 navigation actions');
    process.exit(1);
  }

  console.log('2. Checking Permanent Origin Type Registry...');
  console.log(`   Registered origin types count: ${ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES.length} (Target: 17)`);
  if (ALL_EVIDENCE_NAVIGATION_ORIGIN_TYPES.length < 17) {
    console.error('   [FAIL] Missing required origin types');
    process.exit(1);
  }

  console.log('3. Checking AI Safety Restrictions...');
  const restrictions = getMandatoryAIRestrictions();
  const restrictionCount = Object.keys(restrictions).length;
  console.log(`   Active AI restrictions count: ${restrictionCount} (Target: 12)`);
  if (restrictionCount !== 12) {
    console.error('   [FAIL] Expected 12 mandatory AI restrictions');
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('🎉 PHASE 15 RELEASE VALIDATION GATE: PASSED');
  console.log('================================================================\n');
}

main();
