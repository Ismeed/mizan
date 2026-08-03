/**
 * Report Section Sequence Test Suite
 * Phase 14 — MIZAN Standard Mirath and Zakat Report Architecture
 */

import { CANONICAL_REPORT_SECTION_IDS } from '@mizan/shared';

describe('Report Section Sequence Tests', () => {
  it('should enforce exactly 12 standard sections in exact canonical sequence', () => {
    expect(CANONICAL_REPORT_SECTION_IDS.length).toBe(12);
    expect(CANONICAL_REPORT_SECTION_IDS[0]).toBe('REPORT_IDENTITY');
    expect(CANONICAL_REPORT_SECTION_IDS[1]).toBe('CALCULATION_PROFILE');
    expect(CANONICAL_REPORT_SECTION_IDS[2]).toBe('INPUT_SUMMARY');
    expect(CANONICAL_REPORT_SECTION_IDS[3]).toBe('VALIDATION_AND_SCOPE');
    expect(CANONICAL_REPORT_SECTION_IDS[4]).toBe('RESULT_SUMMARY');
    expect(CANONICAL_REPORT_SECTION_IDS[5]).toBe('DETAILED_BREAKDOWN');
    expect(CANONICAL_REPORT_SECTION_IDS[6]).toBe('EXCLUDED_AND_REVIEW_ITEMS');
    expect(CANONICAL_REPORT_SECTION_IDS[7]).toBe('EVIDENCE_AND_EXPLANATIONS');
    expect(CANONICAL_REPORT_SECTION_IDS[8]).toBe('TOTALS_AND_RECONCILIATION');
    expect(CANONICAL_REPORT_SECTION_IDS[9]).toBe('WARNINGS_AND_ACTIONS');
    expect(CANONICAL_REPORT_SECTION_IDS[10]).toBe('TECHNICAL_AND_AUDIT_DETAILS');
    expect(CANONICAL_REPORT_SECTION_IDS[11]).toBe('DECLARATION_AND_CLOSING');
  });
});
