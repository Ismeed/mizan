/**
 * MIZAN — Immutable Report Snapshot Contract (Phase 14)
 */

import type { ReportType } from './report-type.registry';
import type { ReportRenderingContext } from './report-rendering-context.types';

export interface ReportSnapshot {
  reportSnapshotId: string;
  reportId: string;
  reportVersion: string;
  sourceResultId: string;
  sourceResultSnapshotId: string;
  reportType: ReportType;
  renderingContext: ReportRenderingContext;
  sectionSnapshots: Array<{
    sectionId: string;
    sequence: number;
    contentChecksum: string;
  }>;
  explanationVersions: Array<{ explanationId: string; version: string }>;
  evidenceVersions: Array<{ evidenceId: string; version: string }>;
  currencySnapshots: Array<{ currencyCode: string; rateDate: string }>;
  template: {
    reportTemplateId: string;
    reportTemplateVersion: string;
  };
  renderedFileChecksum?: string | null;
  reportContentChecksum: string;
  generatedAt: string;
  isImmutable: boolean;
}
