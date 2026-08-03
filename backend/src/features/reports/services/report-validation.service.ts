/**
 * MIZAN — Report Validation Service (Phase 14)
 * Validates report envelope schema, standard section sequence, source result integrity, and checksums.
 */

import type { StandardReportEnvelope } from '@mizan/shared';

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

export interface ReportValidationResult {
  isValid: boolean;
  errors: Array<{ code: string; message: string }>;
}

export class ReportValidationService {
  static validateReport(report: StandardReportEnvelope): ReportValidationResult {
    const errors: Array<{ code: string; message: string }> = [];

    if (!report.reportId) {
      errors.push({ code: 'MISSING_REPORT_ID', message: 'Report is missing reportId' });
    }

    if (!report.source || !report.source.resultId) {
      errors.push({ code: 'MISSING_SOURCE_RESULT', message: 'Report is missing source resultId reference' });
    }

    if (!report.sections || report.sections.length !== 12) {
      errors.push({
        code: 'INVALID_SECTION_COUNT',
        message: `Report must have exactly 12 sections, found ${report.sections?.length}`,
      });
    } else {
      CANONICAL_REPORT_SECTION_IDS.forEach((expectedSecId, idx) => {
        const actualSec = report.sections[idx];
        if (actualSec?.sectionId !== expectedSecId) {
          errors.push({
            code: 'INVALID_SECTION_SEQUENCE',
            message: `Section at index ${idx} must be ${expectedSecId}, found ${actualSec?.sectionId}`,
          });
        }
      });
    }

    if (!report.integrity || !report.integrity.reportChecksum) {
      errors.push({ code: 'MISSING_CHECKSUM', message: 'Report integrity checksum is missing' });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
