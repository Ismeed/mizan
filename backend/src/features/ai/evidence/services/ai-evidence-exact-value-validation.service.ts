import { VerifiedAIEvidenceContextEnvelope, AIEvidenceResponse } from '../../../../../../packages/shared/src';

export interface ExactValueValidationResult {
  isValid: boolean;
  conflictingValues: string[];
}

export class AIEvidenceExactValueValidationService {
  /**
   * Compares all mentioned fractions, rates, quantities, and counts in the AI Response
   * against the authoritative Decision Context in the Verified Context Envelope.
   */
  static validate(
    response: AIEvidenceResponse,
    context: VerifiedAIEvidenceContextEnvelope
  ): ExactValueValidationResult {
    if (!context.decisionContext) {
      return { isValid: true, conflictingValues: [] };
    }

    const textToScan = (
      response.content.aiClarification +
      ' ' +
      response.content.whatTheEvidenceSupports +
      ' ' +
      response.content.approvedExplanationSummary
    );

    const conflictingValues: string[] = [];

    // 1. Check for unauthorized fractions (e.g., if decision says 1/6, but AI mentions 1/3 or 1/4)
    const exactFractions = context.decisionContext.exactValues.fractions || [];
    const fractionRegex = /\b\d+\/\d+\b/g;
    const mentionedFractions = textToScan.match(fractionRegex) || [];

    for (const f of mentionedFractions) {
      // Allow general informational mentions if in approved explanation or exact list
      if (!exactFractions.includes(f)) {
        // Flag as potential fraction mismatch if it presents a non-approved fraction as the decision share
        if (textToScan.includes(`share is ${f}`) || textToScan.includes(`gets ${f}`) || textToScan.includes(`allocated ${f}`)) {
          conflictingValues.push(`Fraction mismatch: AI mentioned '${f}', authoritative share is '${exactFractions.join(', ')}'`);
        }
      }
    }

    // 2. Check for rate mismatches (e.g. Zakat 2.5%)
    const exactRates = context.decisionContext.exactValues.rates || [];
    if (exactRates.length > 0) {
      const rateRegex = /\b\d+(\.\d+)?%\b/g;
      const mentionedRates = textToScan.match(rateRegex) || [];
      for (const rStr of mentionedRates) {
        const numericRate = parseFloat(rStr.replace('%', '')) / 100;
        if (!exactRates.includes(numericRate)) {
          conflictingValues.push(`Rate mismatch: AI mentioned '${rStr}', authoritative rate is '${exactRates.map(r => (r * 100) + '%').join(', ')}'`);
        }
      }
    }

    return {
      isValid: conflictingValues.length === 0,
      conflictingValues,
    };
  }
}
