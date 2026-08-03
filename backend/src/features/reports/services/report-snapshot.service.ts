/**
 * MIZAN — Report Snapshot Service (Phase 14)
 * Creates and retrieves immutable report snapshots.
 */

import type { StandardReportEnvelope, ReportSnapshot } from '@mizan/shared';
import { ResultIntegrityService } from '../../results/services/result-integrity.service';
import crypto from 'crypto';

export class ReportSnapshotService {
  static createSnapshot(report: StandardReportEnvelope, renderedFileChecksum?: string): ReportSnapshot {
    const reportSnapshotId = `snapshot_report_${crypto.randomUUID()}`;

    const sectionSnapshots = report.sections.map((sec) => ({
      sectionId: sec.sectionId,
      sequence: sec.sequence,
      contentChecksum: ResultIntegrityService.generateChecksum(sec),
    }));

    const reportContentChecksum = ResultIntegrityService.generateChecksum(report);

    return {
      reportSnapshotId,
      reportId: report.reportId,
      reportVersion: report.reportVersion,
      sourceResultId: report.source.resultId,
      sourceResultSnapshotId: report.source.resultSnapshotId,
      reportType: report.reportType,
      renderingContext: report.renderingContext,
      sectionSnapshots,
      explanationVersions: [],
      evidenceVersions: [],
      currencySnapshots: [],
      template: {
        reportTemplateId: report.renderingContext.reportTemplateId,
        reportTemplateVersion: report.renderingContext.reportTemplateVersion,
      },
      renderedFileChecksum: renderedFileChecksum ?? null,
      reportContentChecksum,
      generatedAt: new Date().toISOString(),
      isImmutable: true,
    };
  }
}
