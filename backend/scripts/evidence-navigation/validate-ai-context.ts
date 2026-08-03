import { getMandatoryAIRestrictions } from '../../../packages/shared/src';

function main() {
  console.log('====================================================');
  console.log('MIZAN Evidence Navigation — AI Safety Restrictions CLI');
  console.log('====================================================\n');

  const rest = getMandatoryAIRestrictions();

  const checks = [
    { key: 'mustNotRecalculate', label: 'AI Must Not Recalculate Mirath or Zakat' },
    { key: 'mustNotChangeDecision', label: 'AI Must Not Change Rulings/Fractions/Rates' },
    { key: 'mustNotChangeMadhhab', label: 'AI Must Not Silently Switch Madhhab' },
    { key: 'mustNotInventEvidence', label: 'AI Must Not Invent Evidence' },
    { key: 'mustNotInventSourceText', label: 'AI Must Not Invent Source Text' },
    { key: 'mustNotInventTranslation', label: 'AI Must Not Invent Translations' },
    { key: 'mustNotInventRule', label: 'AI Must Not Invent Rules' },
    { key: 'mustNotInventException', label: 'AI Must Not Invent Exceptions' },
    { key: 'mustNotPresentCommentaryAsEvidence', label: 'AI Must Not Present Commentary as Evidence' },
    { key: 'mustNotUseUnapprovedComparativeContext', label: 'AI Must Not Infer Unapproved Comparisons' },
    { key: 'mustUseProvidedVerifiedContext', label: 'AI Must Use Provided Verified Context' },
    { key: 'mustDiscloseInsufficientContext', label: 'AI Must Disclose Insufficient Context' },
  ];

  let passed = true;
  for (const check of checks) {
    if ((rest as any)[check.key] === true) {
      console.log(`[PASS] Mandatory Restriction Enforced: ${check.label}`);
    } else {
      console.error(`[FAIL] Mandatory Restriction FAILED: ${check.label}`);
      passed = false;
    }
  }

  if (!passed) {
    process.exit(1);
  }

  console.log('\n✅ All 12 Sharia Governance AI Safety Restrictions verified!');
}

main();
