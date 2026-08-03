/**
 * Validate Currency Registry CLI Script
 * Phase 12 — MIZAN Currency Architecture
 *
 * Validates baseline currency definitions against Zod schemas and structural rules.
 */

import { BASELINE_CURRENCY_REGISTRY, CurrencyDefinitionSchema } from '@mizan/shared';

function main() {
  console.log('=== MIZAN Currency Registry Validator ===\n');

  let passed = 0;
  let failed = 0;

  for (const currency of BASELINE_CURRENCY_REGISTRY) {
    const parseRes = CurrencyDefinitionSchema.safeParse(currency);
    if (parseRes.success) {
      console.log(`[PASS] ${currency.currencyCode} (v${currency.version}) — Status: ${currency.governance.status}`);
      passed++;
    } else {
      console.error(`[FAIL] ${currency.currencyCode}:`, parseRes.error.format());
      failed++;
    }
  }

  console.log(`\nValidation complete: ${passed} passed, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();
