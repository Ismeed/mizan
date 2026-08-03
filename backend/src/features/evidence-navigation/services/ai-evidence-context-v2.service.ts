import crypto from 'crypto';
import {
  AIEvidenceContextV2,
  VerifiedHydratedNavigationContext,
  getMandatoryAIRestrictions,
  EvidenceSupportsCategory,
} from '../../../../../packages/shared/src';
import { EvidenceCitationService } from '../../evidence/services/evidence-citation.service';

export class AIEvidenceContextV2Service {
  /**
   * Constructs authoritative AIEvidenceContextV2 with all 12 mandatory AI safety restrictions.
   */
  static buildVerifiedAIContext(hydratedContext: VerifiedHydratedNavigationContext): AIEvidenceContextV2 {
    const payload = hydratedContext.verifiedNavigation;
    const evidenceRec = hydratedContext.evidence as any;

    const lang = payload.profile.languageTag || 'en';
    const madhhab = payload.profile.selectedMadhhab || 'HANAFI';

    const citation = EvidenceCitationService.formatCitation(evidenceRec, lang, madhhab);

    const calcContext = payload.calculation
      ? {
          calculationId: payload.calculation.calculationId,
          resultId: payload.calculation.resultId,
          resultItemId: payload.calculation.resultItemId,
          module: (payload as any).calculation?.module || 'MIRATH',
          selectedMadhhab: madhhab,
          languageTag: lang,
          locale: payload.profile.locale || `${lang}-NG`,
          currencyCode: payload.profile.currencyCode || 'NGN',
          knowledgeReleaseVersion: payload.versions.knowledgeReleaseVersion || '1.0.0',
          ruleEngineVersion: payload.versions.ruleEngineVersion || '1.0.0',
        }
      : null;

    const rawContext: AIEvidenceContextV2 = {
      task: (payload.requestedView?.mode as any) || 'EXPLAIN_VERIFIED_EVIDENCE',
      navigation: {
        navigationId: payload.navigationId,
        action: payload.action,
        payloadVersion: payload.payloadVersion,
        originType: payload.origin.originType,
      },
      calculationContext: calcContext,
      subjectContext: (payload as any).subject
        ? {
            subjectType: (payload as any).subject.subjectType,
            subjectId: (payload as any).subject.subjectId,
            subjectVersion: (payload as any).subject.subjectVersion,
            instanceId: (payload as any).subject.instanceId,
            approvedLocalizedLabel: (payload as any).subject.subjectId,
          }
        : null,
      decisionContext: hydratedContext.resultItem
        ? {
            status: hydratedContext.resultItem.status || 'COMPLETED',
            decisionCode: hydratedContext.resultItem.decisionCode || 'ASSIGNED',
            decisionType: hydratedContext.resultItem.decisionType || 'SHARE_ALLOCATION',
            authoritativePayload: hydratedContext.resultItem,
            exactValues: hydratedContext.resultItem.exactValues || {},
            monetaryValues: [],
          }
        : null,
      ruleContext: hydratedContext.appliedRule
        ? {
            ruleId: hydratedContext.appliedRule.ruleId,
            ruleVersion: hydratedContext.appliedRule.ruleVersion,
            ruleFamilyId: hydratedContext.appliedRule.ruleFamilyId,
            ruleType: hydratedContext.appliedRule.ruleType,
            selectedMadhhab: madhhab,
            resolvedRuleSnapshotId: hydratedContext.appliedRule.resolvedRuleSnapshotId,
            approvedRuleSummary: hydratedContext.appliedRule.descriptionEn || hydratedContext.appliedRule.titleEn || '',
          }
        : null,
      evidenceContext: {
        evidenceId: evidenceRec.evidenceId || payload.evidence.evidenceId,
        evidenceVersion: evidenceRec.version || payload.evidence.evidenceVersion,
        evidenceType: evidenceRec.evidenceType || 'QURAN',
        canonicalReference: citation.reference.full,
        originalText: citation.content.originalText,
        approvedTranslations: [
          {
            languageTag: lang,
            translationText: citation.content.approvedTranslation || citation.reference.full,
            attributionText: citation.content.attributionText || 'MIZAN Approved Translation',
          },
        ],
        sourceMetadata: evidenceRec.sourceProvenance || {},
        supports: (payload.evidence as any).supports || EvidenceSupportsCategory.DECISION,
        evidenceLinkId: (payload.evidence as any).resultEvidenceLinkId,
      },
      explanationContext: hydratedContext.explanation
        ? {
            explanationId: hydratedContext.explanation.explanationId,
            explanationVersion: hydratedContext.explanation.explanationVersion,
            approvedShortExplanation: hydratedContext.explanation.shortExplanation || '',
            approvedFullExplanation: hydratedContext.explanation.fullExplanation || '',
          }
        : null,
      restrictions: getMandatoryAIRestrictions(),
      integrity: {
        contextChecksum: '',
        verifiedAt: new Date().toISOString(),
      },
    };

    // Calculate checksum
    const contextJson = JSON.stringify({
      navId: rawContext.navigation.navigationId,
      evidenceId: rawContext.evidenceContext.evidenceId,
      madhhab: rawContext.evidenceContext.canonicalReference,
      restrictions: rawContext.restrictions,
    });
    rawContext.integrity.contextChecksum = crypto.createHash('sha256').update(contextJson).digest('hex');

    return rawContext;
  }
}
