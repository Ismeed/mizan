import crypto from 'crypto';
import { prisma } from '../../../config/database';
import {
  ReportEvidenceNavigationPayload,
  EvidenceNavigationAction,
  EvidenceNavigationOriginType,
  EvidenceSupportsCategory,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface BuildReportPayloadInput {
  reportId: string;
  reportVersion?: string;
  reportSnapshotId: string;
  reportType?: string;
  reportSectionId: string;
  contentBlockId?: string;
  renderingLanguageTag: string;
  reportCurrencyCode: string;
  calculationId: string;
  resultId: string;
  resultSnapshotId: string;
  resultItemId: string;
  ruleId: string;
  ruleVersion: string;
  evidenceId: string;
  evidenceVersion: string;
  resultEvidenceLinkId: string;
  supports: EvidenceSupportsCategory;
  selectedMadhhab: string;
  calculationLanguageTag: string;
}

export class ReportEvidenceNavigationService {
  /**
   * Builds an authoritative Report Evidence Payload.
   * Preserves report rendering context alongside calculation profile language.
   */
  static buildReportPayload(input: BuildReportPayloadInput): ReportEvidenceNavigationPayload {
    const navId = `NAV-REPORT-${crypto.randomUUID()}`;

    const rawPayload: ReportEvidenceNavigationPayload = {
      navigationId: navId,
      payloadVersion: '1.0.0',
      action: EvidenceNavigationAction.OPEN_AI_REPORT_EVIDENCE,
      origin: {
        originType: EvidenceNavigationOriginType.DIGITAL_REPORT,
        screenId: 'REPORT_VIEWER',
        reportId: input.reportId,
        reportSectionId: input.reportSectionId,
        returnRoute: `/reports/${input.reportId}`,
      },
      calculation: {
        calculationId: input.calculationId,
        resultId: input.resultId,
        resultSnapshotId: input.resultSnapshotId,
        resultItemId: input.resultItemId,
      },
      report: {
        reportId: input.reportId,
        reportVersion: input.reportVersion || '1.0.0',
        reportSnapshotId: input.reportSnapshotId,
        reportType: input.reportType || 'DETAILED_REPORT',
        reportSectionId: input.reportSectionId,
        contentBlockId: input.contentBlockId,
        renderingLanguageTag: input.renderingLanguageTag,
        reportCurrencyCode: input.reportCurrencyCode,
      },
      rule: {
        ruleId: input.ruleId,
        ruleVersion: input.ruleVersion,
      },
      evidence: {
        evidenceId: input.evidenceId,
        evidenceVersion: input.evidenceVersion,
        resultEvidenceLinkId: input.resultEvidenceLinkId,
        supports: input.supports,
      },
      profile: {
        selectedMadhhab: input.selectedMadhhab.toUpperCase(),
        languageTag: input.calculationLanguageTag,
        locale: `${input.calculationLanguageTag}-NG`,
      },
      versions: {
        knowledgeReleaseVersion: '1.0.0',
      },
      security: {
        issuedAt: new Date().toISOString(),
        payloadChecksum: '',
      },
    };

    const checksum = EvidenceNavigationSigningService.generatePayloadChecksum(rawPayload);
    const signature = EvidenceNavigationSigningService.generateSignature(checksum, navId);

    rawPayload.security.payloadChecksum = checksum;
    rawPayload.security.signature = signature;

    return rawPayload;
  }
}
