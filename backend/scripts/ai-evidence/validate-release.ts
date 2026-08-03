import { ALL_AI_EVIDENCE_CONTEXT_TYPES, ALL_AI_EVIDENCE_CONTEXT_BINDINGS, ALL_AI_EVIDENCE_CONTEXT_COMPLETENESS, getStrictAIEvidenceRestrictions } from '../../../packages/shared/src';

console.log('================================================================');
console.log('MIZAN Phase 16 — Master AI Evidence Context Release Gate');
console.log('================================================================');

let passed = true;

// Gate 1: Context Types Registry
console.log('1. Checking AI Evidence Context Types Registry...');
if (ALL_AI_EVIDENCE_CONTEXT_TYPES.length >= 14) {
  console.log(`   [PASS] Registered context types count: ${ALL_AI_EVIDENCE_CONTEXT_TYPES.length}`);
} else {
  console.log(`   [FAIL] Insufficient context types: ${ALL_AI_EVIDENCE_CONTEXT_TYPES.length}`);
  passed = false;
}

// Gate 2: Context Bindings Registry
console.log('2. Checking AI Evidence Context Bindings Registry...');
if (ALL_AI_EVIDENCE_CONTEXT_BINDINGS.length >= 5) {
  console.log(`   [PASS] Registered context bindings count: ${ALL_AI_EVIDENCE_CONTEXT_BINDINGS.length}`);
} else {
  console.log(`   [FAIL] Insufficient context bindings: ${ALL_AI_EVIDENCE_CONTEXT_BINDINGS.length}`);
  passed = false;
}

// Gate 3: Completeness Registry
console.log('3. Checking AI Evidence Completeness Registry...');
if (ALL_AI_EVIDENCE_CONTEXT_COMPLETENESS.length >= 5) {
  console.log(`   [PASS] Registered completeness statuses count: ${ALL_AI_EVIDENCE_CONTEXT_COMPLETENESS.length}`);
} else {
  console.log(`   [FAIL] Insufficient completeness statuses: ${ALL_AI_EVIDENCE_CONTEXT_COMPLETENESS.length}`);
  passed = false;
}

// Gate 4: Strict AI Restrictions
console.log('4. Checking Strict AI Restrictions Contract...');
const restrictions = getStrictAIEvidenceRestrictions();
if (
  restrictions.calculation.mustNotRecalculate &&
  restrictions.madhhab.mustNotSwitchMadhhab &&
  restrictions.evidence.mustNotInventEvidence &&
  restrictions.rules.mustNotInventRule &&
  restrictions.currency.mustNotInventExchangeRate &&
  restrictions.response.mustUseVerifiedPackageOnly
) {
  console.log('   [PASS] All functional scope AI restrictions verified');
} else {
  console.log('   [FAIL] Missing strict AI restrictions');
  passed = false;
}

console.log('================================================================');
if (passed) {
  console.log('🎉 PHASE 16 RELEASE VALIDATION GATE: PASSED');
  console.log('================================================================');
  process.exit(0);
} else {
  console.error('❌ PHASE 16 RELEASE VALIDATION GATE: FAILED');
  console.log('================================================================');
  process.exit(1);
}
