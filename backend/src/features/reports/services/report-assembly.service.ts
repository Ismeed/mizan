/**
 * MIZAN — Report Assembly Service (Phase 14)
 * Orchestrates full StandardReportEnvelope assembly exclusively from CalculationResultEnvelope.
 * NEVER recalculates or calls AI.
 */

import type {
  CalculationResultEnvelope,
  StandardReportEnvelope,
  ReportType,
  ReportStatus,
  ReportSectionContract,
  ReportRenderingContext,
} from '@mizan/shared';
import { MirathReportSectionAdapter } from './mirath-report-section.adapter';
import { ZakatReportSectionAdapter } from './zakat-report-section.adapter';
import { ReportTemplateRegistryService } from './report-template-registry.service';
import { ResultIntegrityService } from '../../results/services/result-integrity.service';
import crypto from 'crypto';

export interface ReportAssemblyOptions {
  envelope: CalculationResultEnvelope;
  reportType?: ReportType;
  renderingContext?: Partial<ReportRenderingContext>;
}

export class ReportAssemblyService {
  static assembleReport(options: ReportAssemblyOptions): StandardReportEnvelope {
    const { envelope } = options;
    const reportType = options.reportType ?? 'DETAILED_REPORT';
    const reportId = `report_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const template = ReportTemplateRegistryService.getTemplate();

    const renderingContext: ReportRenderingContext = {
      languageTag: options.renderingContext?.languageTag ?? envelope.profile.language.languageTag,
      locale: options.renderingContext?.locale ?? envelope.profile.language.locale,
      direction: options.renderingContext?.direction ?? envelope.profile.language.direction,
      reportCurrencyCode: options.renderingContext?.reportCurrencyCode ?? envelope.profile.currency.reportCurrencyCode,
      selectedMadhhab: envelope.profile.madhhab,
      reportTemplateId: template.reportTemplateId,
      reportTemplateVersion: template.version,
      format: options.renderingContext?.format ?? 'PDF',
      renderingMode: options.renderingContext?.renderingMode ?? 'DETAILED',
      generatedAt: now,
      historicalRendering: options.renderingContext?.historicalRendering ?? false,
      alternativeCurrencyRendering: options.renderingContext?.alternativeCurrencyRendering ?? false,
      exchangeRateSnapshot: options.renderingContext?.exchangeRateSnapshot ?? null,
    };

    const adaptedContent =
      envelope.module === 'MIRATH'
        ? MirathReportSectionAdapter.adaptSections(envelope)
        : ZakatReportSectionAdapter.adaptSections(envelope);

    const sections: ReportSectionContract[] = template.sectionSequence.map((secId, idx) => {
      const secContent = adaptedContent[secId] ?? {};
      return {
        sectionInstanceId: `sec_${secId.toLowerCase()}_${reportId}`,
        sectionId: secId,
        sequence: idx + 1,
        status: envelope.status === 'REVIEW_REQUIRED' ? 'REVIEW_REQUIRED' : 'AVAILABLE',
        titleKey: `reports.sections.${secId}.title`,
        contentBlocks: [
          {
            blockId: `blk_${secId.toLowerCase()}_${reportId}`,
            blockType: 'PARAGRAPH_BLOCK',
            sequence: 1,
            titleKey: `reports.sections.${secId}.title`,
            payload: secContent,
          },
        ],
        resultItemIds: envelope.resultItems.map((i) => i.resultItemId),
        evidenceIds: envelope.resultItems.flatMap((i: any) => i.evidenceLinks?.map((e: any) => e.evidenceId) ?? []),
        explanationIds: envelope.resultItems.flatMap((i: any) => i.explanationLinks?.map((e: any) => e.explanationId) ?? []),
        warnings: envelope.warnings.map((w) => w.warningCode),
        pageBehaviour: {
          startOnNewPage: secId === 'REPORT_IDENTITY' || secId === 'DETAILED_BREAKDOWN',
          avoidPageBreakInside: true,
        },
        visibility: {
          summaryReport: secId !== 'TECHNICAL_AND_AUDIT_DETAILS',
          detailedReport: true,
          scholarReport: true,
          technicalAuditReport: true,
        },
      };
    });

    let reportStatus: ReportStatus = 'GENERATED';
    if (envelope.status === 'COMPLETED_WITH_WARNINGS') {
      reportStatus = 'GENERATED_WITH_WARNINGS';
    } else if (envelope.status === 'REVIEW_REQUIRED') {
      reportStatus = 'REVIEW_REQUIRED';
    } else if (envelope.status !== 'COMPLETED') {
      reportStatus = 'PARTIAL';
    }

    const coreEnvelopePartial = {
      reportId,
      reportVersion: '1.0.0',
      reportSchemaVersion: '1.0.0',
      reportType,
      source: {
        calculationId: envelope.calculationId,
        resultId: envelope.resultId,
        resultVersion: envelope.resultVersion,
        resultSchemaVersion: envelope.resultSchemaVersion,
        resultSnapshotId: envelope.integrity.resultSnapshotId,
      },
      module: envelope.module,
      status: reportStatus,
      renderingContext,
      sections,
      attachments: [],
      audit: {
        createdAt: now,
        createdByService: 'MIZAN_REPORT_ASSEMBLY_SERVICE',
        reportRequestId: `req_${crypto.randomUUID()}`,
        templateVersion: template.version,
      },
    };

    const reportChecksum = ResultIntegrityService.generateChecksum(coreEnvelopePartial);

    return {
      ...coreEnvelopePartial,
      integrity: {
        reportChecksum,
        resultChecksum: envelope.integrity.resultChecksum,
        templateChecksum: template.integrity.contentChecksum,
        renderedFileChecksum: null,
        isImmutable: true,
        verifiedAt: now,
      },
    };
  }
}
