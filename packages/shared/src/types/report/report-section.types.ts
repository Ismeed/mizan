/**
 * MIZAN — Permanent Report Section Identifiers & Contract (Phase 14)
 * Every Mirath and Zakat report MUST use these 12 section IDs in this exact sequence.
 */

export const CANONICAL_REPORT_SECTION_IDS = [
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

export type ReportSectionId = (typeof CANONICAL_REPORT_SECTION_IDS)[number];

export type ReportSectionStatus =
  | 'AVAILABLE'
  | 'NOT_APPLICABLE'
  | 'PARTIAL'
  | 'REVIEW_REQUIRED'
  | 'HIDDEN_BY_TEMPLATE_POLICY';

export interface ReportSectionVisibility {
  summaryReport: boolean;
  detailedReport: boolean;
  scholarReport: boolean;
  technicalAuditReport: boolean;
}

export interface ReportSectionPageBehaviour {
  startOnNewPage: boolean;
  avoidPageBreakInside: boolean;
}

export interface ReportSectionContract {
  sectionInstanceId: string;
  sectionId: ReportSectionId;
  sequence: number; // 1 to 12
  status: ReportSectionStatus;
  titleKey: string;
  contentBlocks: any[];
  resultItemIds: string[];
  evidenceIds: string[];
  explanationIds: string[];
  warnings: string[];
  pageBehaviour: ReportSectionPageBehaviour;
  visibility: ReportSectionVisibility;
}
