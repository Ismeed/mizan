import crypto from 'crypto';
import {
  EvidenceNavigationAction,
  EvidenceNavigationOriginType,
  EvidenceSupportsCategory,
  ResultEvidenceNavigationPayload,
  HijabEvidenceNavigationPayload,
  MirathShareEvidenceNavigationPayload,
  ZakatEvidenceNavigationPayload,
  NisabEvidenceNavigationPayload,
  LivestockEvidenceNavigationPayload,
  AgricultureEvidenceNavigationPayload,
  ReportEvidenceNavigationPayload,
  StandaloneEvidenceNavigationPayload,
  ComparativeEvidenceNavigationPayload,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface BuildStandalonePayloadInput {
  evidenceId: string;
  evidenceVersion: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_REFERENCE' | 'SCHOLARLY_REFERENCE';
  selectedMadhhab: string;
  languageTag: string;
  locale?: string;
  action?: typeof EvidenceNavigationAction.OPEN_AI_EVIDENCE | typeof EvidenceNavigationAction.OPEN_EVIDENCE_READER;
}

export interface BuildResultItemPayloadInput {
  calculationId: string;
  calculationProfileId: string;
  resultId: string;
  resultVersion?: string;
  resultSnapshotId: string;
  resultItemId: string;
  subjectType: 'HEIR' | 'ZAKAT_CATEGORY' | 'LIVESTOCK_ASSET' | 'HARVEST_GROUP' | 'ESTATE' | 'CALCULATION';
  subjectId: string;
  subjectVersion?: string;
  instanceId?: string;
  ruleId: string;
  ruleVersion: string;
  ruleFamilyId?: string;
  ruleType?: string;
  resolvedRuleSnapshotId?: string;
  evidenceId: string;
  evidenceVersion: string;
  resultEvidenceLinkId: string;
  supports: EvidenceSupportsCategory;
  explanationId?: string | null;
  explanationVersion?: string | null;
  selectedMadhhab: string;
  languageTag: string;
  locale?: string;
  currencyCode?: string;
  knowledgeReleaseVersion?: string;
  ruleEngineVersion?: string;
  originType?: string;
  screenId?: string;
}

export class EvidenceNavigationBuilderService {
  /**
   * Builds a Standalone Evidence Payload (for Evidence Library navigation).
   */
  static buildStandalonePayload(input: BuildStandalonePayloadInput): StandaloneEvidenceNavigationPayload {
    const navId = `NAV-STANDALONE-${crypto.randomUUID()}`;
    const action = input.action || EvidenceNavigationAction.OPEN_AI_EVIDENCE;

    const rawPayload: StandaloneEvidenceNavigationPayload = {
      navigationId: navId,
      payloadVersion: '1.0.0',
      action,
      origin: {
        originType: EvidenceNavigationOriginType.EVIDENCE_LIBRARY,
        screenId: 'EVIDENCE_LIBRARY',
      },
      evidence: {
        evidenceId: input.evidenceId,
        evidenceVersion: input.evidenceVersion,
        evidenceType: input.evidenceType,
      },
      profile: {
        selectedMadhhab: input.selectedMadhhab.toUpperCase(),
        languageTag: input.languageTag,
        locale: input.locale || `${input.languageTag}-NG`,
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

  /**
   * Builds a Result Item Evidence Payload.
   */
  static buildResultItemPayload(input: BuildResultItemPayloadInput): ResultEvidenceNavigationPayload {
    const navId = `NAV-RESULT-${crypto.randomUUID()}`;
    const originType = (input.originType as any) || EvidenceNavigationOriginType.RESULT_ITEM;

    const rawPayload: ResultEvidenceNavigationPayload = {
      navigationId: navId,
      payloadVersion: '1.0.0',
      action: EvidenceNavigationAction.OPEN_AI_RESULT_EVIDENCE,
      origin: {
        originType,
        screenId: input.screenId || 'CALCULATION_RESULT',
      },
      calculation: {
        calculationId: input.calculationId,
        calculationProfileId: input.calculationProfileId,
        resultId: input.resultId,
        resultVersion: input.resultVersion || '1.0.0',
        resultSnapshotId: input.resultSnapshotId,
        resultItemId: input.resultItemId,
      },
      subject: {
        subjectType: input.subjectType,
        subjectId: input.subjectId,
        subjectVersion: input.subjectVersion || '1.0.0',
        instanceId: input.instanceId,
      },
      rule: {
        ruleId: input.ruleId,
        ruleVersion: input.ruleVersion,
        ruleFamilyId: input.ruleFamilyId,
        ruleType: input.ruleType,
        resolvedRuleSnapshotId: input.resolvedRuleSnapshotId,
      },
      evidence: {
        evidenceId: input.evidenceId,
        evidenceVersion: input.evidenceVersion,
        resultEvidenceLinkId: input.resultEvidenceLinkId,
        supports: input.supports,
      },
      explanation: input.explanationId
        ? { explanationId: input.explanationId, explanationVersion: input.explanationVersion || '1.0.0' }
        : null,
      profile: {
        selectedMadhhab: input.selectedMadhhab.toUpperCase(),
        languageTag: input.languageTag,
        locale: input.locale || `${input.languageTag}-NG`,
        currencyCode: input.currencyCode || 'NGN',
      },
      versions: {
        knowledgeReleaseVersion: input.knowledgeReleaseVersion || '1.0.0',
        ruleEngineVersion: input.ruleEngineVersion || '1.0.0',
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

  /**
   * Builds a Hijab Evidence Payload.
   */
  static buildHijabPayload(input: BuildResultItemPayloadInput & {
    blockedHeirId: string;
    blockedHeirInstanceId?: string;
    blockers: Array<{ blockerHeirId: string; blockerInstanceId?: string }>;
    hijabType: 'COMPLETE_EXCLUSION' | 'PARTIAL_REDUCTION';
    effectType: string;
  }): HijabEvidenceNavigationPayload {
    const navId = `NAV-HIJAB-${crypto.randomUUID()}`;

    const rawPayload: HijabEvidenceNavigationPayload = {
      navigationId: navId,
      payloadVersion: '1.0.0',
      action: EvidenceNavigationAction.OPEN_AI_HIJAB_EVIDENCE,
      origin: {
        originType: EvidenceNavigationOriginType.HIJAB_RESULT_CARD,
        screenId: 'MIRATH_RESULT',
      },
      calculation: {
        calculationId: input.calculationId,
        calculationProfileId: input.calculationProfileId,
        resultId: input.resultId,
        resultSnapshotId: input.resultSnapshotId,
        resultItemId: input.resultItemId,
      },
      subject: {
        subjectType: 'HEIR',
        subjectId: input.subjectId,
        subjectVersion: input.subjectVersion || '1.0.0',
        instanceId: input.instanceId,
      },
      hijabContext: {
        blockedHeirId: input.blockedHeirId,
        blockedHeirInstanceId: input.blockedHeirInstanceId,
        blockers: input.blockers,
        hijabType: input.hijabType,
        effectType: input.effectType,
      },
      rule: {
        ruleId: input.ruleId,
        ruleVersion: input.ruleVersion,
        ruleFamilyId: input.ruleFamilyId,
        ruleType: 'HIJAB_RULE',
        resolvedRuleSnapshotId: input.resolvedRuleSnapshotId,
      },
      evidence: {
        evidenceId: input.evidenceId,
        evidenceVersion: input.evidenceVersion,
        resultEvidenceLinkId: input.resultEvidenceLinkId,
        supports: input.supports || EvidenceSupportsCategory.BLOCKING,
      },
      explanation: input.explanationId
        ? { explanationId: input.explanationId, explanationVersion: input.explanationVersion || '1.0.0' }
        : null,
      profile: {
        selectedMadhhab: input.selectedMadhhab.toUpperCase(),
        languageTag: input.languageTag,
        locale: input.locale || `${input.languageTag}-NG`,
      },
      versions: {
        knowledgeReleaseVersion: input.knowledgeReleaseVersion || '1.0.0',
        ruleEngineVersion: input.ruleEngineVersion || '1.0.0',
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
