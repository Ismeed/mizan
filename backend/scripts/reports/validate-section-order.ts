/**
 * CLI Command — Validate Standard Section Sequence (Phase 14)
 * Usage: npm run reports:validate-section-order
 */

import { ReportAssemblyService } from '../../src/features/reports/services/report-assembly.service';
import { CalculationResultAssemblerService } from '../../src/features/results/services/calculation-result-assembler.service';

const CANONICAL_REPORT_SECTION_IDS = [
  'REPORT_IDENTITY',
  'CALCULATION_PROFILE',
  'INPUT_SUMMARY',
  'VALIDATION_AND_SCOPE',
  'RESULT_SUMMARY',
  'DETAILED_BREAKDOWN',
  'EXCLUDED_AND_REVIEW_ITEMS',
  'EVIDENCE_AND_EXPLANATIONS',
  'TOTALS_AND_RECONCILIATION',
  'WARNINGS_AND_ACTIONS',
  'TECHNICAL_AND_AUDIT_DETAILS',
  'DECLARATION_AND_CLOSING',
] as const;

function main() {
  console.log('🔍 Testing Canonical 12-Section Sequence Order...');

  const mockProfile: any = {
    calculationProfileId: 'prof_seq_1',
    userId: 'user_seq',
    module: 'MIRATH',
    preferences: {
      madhhab: { selected: 'HANAFI', resolved: 'HANAFI', source: 'USER_PROFILE' },
      language: { tag: 'en', locale: 'en-US', direction: 'LTR', source: 'USER_PROFILE' },
      currency: { code: 'USD', symbol: '$', decimalPlaces: 2, locale: 'en-US', source: 'USER_PROFILE' },
      region: { countryCode: 'US', timezone: 'UTC', source: 'USER_PROFILE' },
    },
    versions: { profileSchemaVersion: '1.0.0', knowledgeReleaseVersion: '1.0.0', ruleEngineVersion: '1.0.0', reportSchemaVersion: '1.0.0' },
    createdAt: new Date().toISOString(),
    isImmutable: true,
  };

  const calcEnvelope = CalculationResultAssemblerService.assembleEnvelope({
    calculationId: 'calc_seq',
    module: 'MIRATH',
    profile: mockProfile,
    rawInput: { netEstate: 100000 },
    mirathResult: {
      netEstate: 100000,
      shares: [],
      totalAllocated: 0,
      unallocated: 100000,
      calculationMethod: 'NORMAL',
      madhhab: 'HANAFI',
    },
  });

  const report = ReportAssemblyService.assembleReport({ envelope: calcEnvelope });

  CANONICAL_REPORT_SECTION_IDS.forEach((expectedSec, idx) => {
    const actualSec = report.sections[idx].sectionId;
    if (actualSec !== expectedSec) {
      console.error(`❌ Section Mismatch at index ${idx}: expected ${expectedSec}, got ${actualSec}`);
      process.exit(1);
    }
    console.log(`  [${idx + 1}/12] ${actualSec} — OK`);
  });

  console.log('🎉 12-Section Canonical Sequence Order PASSED 100%');
}

main();
