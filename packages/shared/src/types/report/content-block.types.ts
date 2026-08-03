/**
 * MIZAN — Report Content Block Types & Schemas (Phase 14)
 * Controlled content block types for report sections.
 */

export type ContentBlockType =
  | 'REPORT_TITLE_BLOCK'
  | 'PROFILE_SUMMARY_BLOCK'
  | 'KEY_VALUE_BLOCK'
  | 'RESULT_SUMMARY_BLOCK'
  | 'MIRATH_HEIR_TABLE'
  | 'MIRATH_DISTRIBUTION_TABLE'
  | 'BLOCKED_HEIR_TABLE'
  | 'ZAKAT_CATEGORY_TABLE'
  | 'LIVESTOCK_OBLIGATION_TABLE'
  | 'AGRICULTURE_OBLIGATION_TABLE'
  | 'PHYSICAL_OBLIGATION_BLOCK'
  | 'MONETARY_TOTAL_BLOCK'
  | 'EVIDENCE_REFERENCE_BLOCK'
  | 'EXPLANATION_BLOCK'
  | 'WARNING_BLOCK'
  | 'REVIEW_REQUIRED_BLOCK'
  | 'RECONCILIATION_BLOCK'
  | 'AUDIT_METADATA_BLOCK'
  | 'SIGNATURE_BLOCK'
  | 'DISCLAIMER_BLOCK'
  | 'APPENDIX_BLOCK'
  | 'PARAGRAPH_BLOCK';

export interface BaseContentBlock {
  blockId: string;
  blockType: ContentBlockType;
  sequence: number;
  titleKey?: string;
  payload: Record<string, unknown>;
}
