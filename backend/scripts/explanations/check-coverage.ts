/**
 * CLI Tool: Check Translation Coverage
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { BASELINE_LANGUAGE_REGISTRY } from '@mizan/shared';
import { TranslationCoverageService } from '../../src/features/explanations/services/translation-coverage.service';

function main() {
  console.log('=== MIZAN Translation Coverage Report ===');

  const languages = Object.keys(BASELINE_LANGUAGE_REGISTRY);
  for (const lang of languages) {
    const report = TranslationCoverageService.computeCoverage(
      lang,
      ['MIRATH-EXPLANATION-SPOUSE-SHARE-001', 'ZAKAT-EXPLANATION-NISAB-RESULT-001'],
      lang === 'en' ? ['MIRATH-EXPLANATION-SPOUSE-SHARE-001', 'ZAKAT-EXPLANATION-NISAB-RESULT-001'] : [],
      lang === 'ha' ? ['MIRATH-EXPLANATION-SPOUSE-SHARE-001'] : []
    );

    console.log(`Language: [${report.languageTag.toUpperCase()}]`);
    console.log(`  - Total Required: ${report.totalRequiredExplanations}`);
    console.log(`  - Approved: ${report.approvedTranslations}`);
    console.log(`  - Draft: ${report.draftTranslations}`);
    console.log(`  - Missing: ${report.missingTranslations}`);
    console.log(`  - Coverage: ${report.coveragePercentage}%`);
    if (report.productionBlockers.length > 0) {
      console.log(`  - Blockers: ${report.productionBlockers.join(', ')}`);
    }
    console.log('-----------------------------------');
  }
}

main();
