export type QuestionClassification =
  | 'ALLOWED_EXPLANATION'
  | 'ALLOWED_TERMINOLOGY'
  | 'ALLOWED_SOURCE_DISPLAY'
  | 'ALLOWED_RESULT_CLARIFICATION'
  | 'REQUIRES_APPROVED_COMPARATIVE_CONTEXT'
  | 'REQUIRES_RECALCULATION'
  | 'OUTSIDE_VERIFIED_CONTEXT'
  | 'PROMPT_INJECTION_ATTEMPT'
  | 'UNSAFE_OR_UNSUPPORTED';

export interface QuestionValidationResult {
  classification: QuestionClassification;
  requiresRecalculation: boolean;
  requiresComparativeRecord: boolean;
  isAllowed: boolean;
  reasonCode?: string;
}

export class AIEvidenceQuestionValidationService {
  /**
   * Classifies user questions and detects questions requiring recalculation or comparative context.
   */
  static validateQuestion(questionText: string, isPromptInjection: boolean = false): QuestionValidationResult {
    if (isPromptInjection) {
      return {
        classification: 'PROMPT_INJECTION_ATTEMPT',
        requiresRecalculation: false,
        requiresComparativeRecord: false,
        isAllowed: false,
        reasonCode: 'PROMPT_INJECTION_DETECTED',
      };
    }

    const q = questionText.toLowerCase();

    // Recalculation signals
    if (
      q.includes('recalculate') ||
      q.includes('change heirs') ||
      q.includes('add son') ||
      q.includes('remove daughter') ||
      q.includes('recompute') ||
      q.includes('what if I have') ||
      q.includes('what if my wealth is')
    ) {
      return {
        classification: 'REQUIRES_RECALCULATION',
        requiresRecalculation: true,
        requiresComparativeRecord: false,
        isAllowed: false,
        reasonCode: 'RECALCULATION_REQUIRED_FORWARD_TO_RULE_ENGINE',
      };
    }

    // Comparative signals
    if (
      q.includes('other madhhab') ||
      q.includes('difference betweenhanafi and maliki') ||
      q.includes('what about shafii') ||
      q.includes('compare schools')
    ) {
      return {
        classification: 'REQUIRES_APPROVED_COMPARATIVE_CONTEXT',
        requiresRecalculation: false,
        requiresComparativeRecord: true,
        isAllowed: true,
      };
    }

    // Terminology signals
    if (q.includes('meaning of') || q.includes('define') || q.includes('what isnisab') || q.includes('what is hawl')) {
      return {
        classification: 'ALLOWED_TERMINOLOGY',
        requiresRecalculation: false,
        requiresComparativeRecord: false,
        isAllowed: true,
      };
    }

    // Source display signals
    if (q.includes('arabic text') || q.includes('original verse') || q.includes('show Hadith text')) {
      return {
        classification: 'ALLOWED_SOURCE_DISPLAY',
        requiresRecalculation: false,
        requiresComparativeRecord: false,
        isAllowed: true,
      };
    }

    // Default: Explanation
    return {
      classification: 'ALLOWED_EXPLANATION',
      requiresRecalculation: false,
      requiresComparativeRecord: false,
      isAllowed: true,
    };
  }
}
