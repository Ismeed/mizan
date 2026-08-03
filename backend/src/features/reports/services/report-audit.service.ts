/**
 * MIZAN — Report Audit Service (Phase 14)
 * Audit logging for report assembly, rendering, export, and verification events.
 */

import type { StandardReportEnvelope } from '@mizan/shared';

export interface ReportAuditEvent {
  eventId: string;
  reportId: string;
  eventType: 'REPORT_ASSEMBLED' | 'REPORT_RENDERED' | 'REPORT_PDF_GENERATED' | 'HISTORICAL_REPORT_ACCESSED' | 'INTEGRITY_VERIFIED';
  timestamp: string;
  service: string;
  details: Record<string, unknown>;
}

export class ReportAuditService {
  private static auditLogs: ReportAuditEvent[] = [];

  static logEvent(report: StandardReportEnvelope, eventType: ReportAuditEvent['eventType'], details: Record<string, unknown> = {}) {
    const log: ReportAuditEvent = {
      eventId: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      reportId: report.reportId,
      eventType,
      timestamp: new Date().toISOString(),
      service: 'MIZAN_REPORT_ENGINE',
      details: {
        resultId: report.source.resultId,
        module: report.module,
        madhhab: report.renderingContext.selectedMadhhab,
        reportType: report.reportType,
        ...details,
      },
    };
    this.auditLogs.push(log);
    return log;
  }

  static getAuditLogsForReport(reportId: string): ReportAuditEvent[] {
    return this.auditLogs.filter((l) => l.reportId === reportId);
  }
}
