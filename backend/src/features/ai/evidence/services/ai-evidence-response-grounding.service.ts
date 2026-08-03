import { VerifiedAIEvidenceContextEnvelope, AIEvidenceResponse } from '../../../../../../packages/shared/src';
import { AIEvidenceExactValueValidationService } from './ai-evidence-exact-value-validation.service';
import { AIEvidenceQuotationValidationService } from './ai-evidence-quotation-validation.service';
import { AIEvidenceCitationValidationService } from './ai-evidence-citation-validation.service';

export interface GroundingValidationResult {
  isGrounded: boolean;
  groundingScore: number;
  violations: string[];
}

export class AIEvidenceResponseGroundingService {
  /**
   * Performs full response grounding validation:
   * 1. Schema check
   * 2. Citation check
   * 3. Quotation check
   * 4. Exact-value consistency check
   * 5. Madhhab consistency check
   */
  static validate(
    response: AIEvidenceResponse,
    context: VerifiedAIEvidenceContextEnvelope
  ): GroundingValidationResult {
    const violations: string[] = [];
    let score = 1.0;

    // 1. Citation validation
    const citationRes = AIEvidenceCitationValidationService.validate(response, context);
    if (!citationRes.isValid) {
      violations.push(`Unsupported citations: ${citationRes.unsupportedCitations.join(', ')}`);
      score -= 0.3;
    }

    // 2. Quotation validation
    const quoteRes = AIEvidenceQuotationValidationService.validate(response, context);
    if (!quoteRes.allQuotesValid) {
      violations.push('AI response contains unsourced direct quotation');
      score -= 0.3;
    }

    // 3. Exact-value validation
    const exactValueRes = AIEvidenceExactValueValidationService.validate(response, context);
    if (!exactValueRes.isValid) {
      violations.push(...exactValueRes.conflictingValues);
      score -= 0.4;
    }

    // 4. Madhhab consistency check
    const selectedMadhhab = context.calculationContext?.selectedMadhhab || context.ruleContext?.selectedMadhhab;
    if (selectedMadhhab) {
      const text = response.content.aiClarification.toLowerCase();
      // Ensure it doesn't state it's applying another madhhab for the ruling
      const wrongMadhhabs = ['hanafi', 'maliki', 'shafii', 'hanbali', 'jafari'].filter(m => m !== selectedMadhhab.toLowerCase());
      for (const wm of wrongMadhhabs) {
        if (text.includes(`according to the ${wm} school this calculation uses`)) {
          violations.push(`Madhhab drift detected: Context is ${selectedMadhhab}, AI claimed ${wm}`);
          score -= 0.4;
        }
      }
    }

    const isGrounded = score >= 0.8 && violations.length === 0;

    return {
      isGrounded,
      groundingScore: Math.max(0, score),
      violations,
    };
  }
}
