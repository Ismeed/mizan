/**
 * MIZAN — Standard Report Envelope (Phase 14)
 * Top-level canonical report contract generated exclusively from CalculationResultEnvelope.
 */

import type { ReportType } from './report-type.registry';
import type { ReportStatus } from './report-status.types';
import type { ReportSectionContract } from './report-section.types';
import type { ReportRenderingContext } from './report-rendering-context.types';

export interface ReportSourceReference {
  calculationId: string;
  resultId: string;
  resultVersion: string;
  resultSchemaVersion: string;
  resultSnapshotId: string;
}

export interface ReportAuditMetadata {
  createdAt: string;
  createdByService: string;
  reportRequestId: string;
  templateVersion: string;
}

export interface ReportIntegrityMetadata {
  reportChecksum: string;
  resultChecksum: string;
  templateChecksum: string;
  renderedFileChecksum?: string | null;
  isImmutable: boolean;
  verifiedAt: string;
}

export interface StandardReportEnvelope {
  reportId: string;
  reportVersion: string;
  reportSchemaVersion: string;
  reportType: ReportType;
  source: ReportSourceReference;
  module: 'MIRATH' | 'ZAKAT';
  status: ReportStatus;
  renderingContext: ReportRenderingContext;
  sections: ReportSectionContract[];
  attachments: Array<{ attachmentId: string; type: string; title: string; payload: Record<string, unknown> }>;
  audit: ReportAuditMetadata;
  integrity: ReportIntegrityMetadata;
}
