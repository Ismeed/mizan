import { AIEvidenceContext, getDefaultAIRestrictions, BaseEvidence } from '@mizan/shared';
import { EvidenceCitationService } from './evidence-citation.service';

export interface BuildAIContextInput {
  calculationId?: string;
  module: 'MIRATH' | 'ZAKAT';
  selectedMadhhab: string;
  currencyCode?: string;
  languageTag?: string;
  ruleEngineVersion?: string;
  knowledgeReleaseVersion?: string;
  ruleId: string;
  ruleVersion: string;
  decisionType: string;
  structuredDecision: Record<string, any>;
  evidence: BaseEvidence;
  approvedExplanation?: string;
}

export class AIEvidenceContextService {
  /**
   * Prepares a verified AIEvidenceContext package enforcing all 8 non-negotiable AI safety restrictions.
   */
  static prepareContext(input: BuildAIContextInput): AIEvidenceContext {
    const lang = input.languageTag || 'en';
    const citation = EvidenceCitationService.formatCitation(input.evidence, lang, input.selectedMadhhab);

    return {
      task: 'EXPLAIN_EVIDENCE',
      calculationContext: {
        calculationId: input.calculationId,
        module: input.module,
        selectedMadhhab: input.selectedMadhhab,
        currencyCode: input.currencyCode || 'NGN',
        languageTag: lang,
        ruleEngineVersion: input.ruleEngineVersion || '1.0.0',
        knowledgeReleaseVersion: input.knowledgeReleaseVersion || '1.0.0',
      },
      ruleContext: {
        ruleId: input.ruleId,
        ruleVersion: input.ruleVersion,
        decisionType: input.decisionType,
        structuredDecision: input.structuredDecision,
        approvedExplanation: input.approvedExplanation,
      },
      evidenceContext: {
        evidenceId: input.evidence.evidenceId,
        evidenceVersion: input.evidence.version,
        evidenceType: input.evidence.evidenceType,
        canonicalReference: citation.reference.full,
        originalText: citation.content.originalText,
        approvedTranslation: citation.content.approvedTranslation,
        approvedTranslationSource: citation.content.attributionText,
        madhhabScope: input.evidence.madhhabScope?.appliesTo || [],
        fiqhContext: input.evidence.identity?.topics || [],
      },
      // ALL 8 MUST-NOT RESTRICTIONS MANDATED BY SHARIA GOVERNANCE
      restrictions: getDefaultAIRestrictions(),
    };
  }
}
