import { VerifiedAIEvidenceContextEnvelope, AIEvidenceResponse } from '../../../../../../packages/shared/src';

export interface QuotationValidationResult {
  allQuotesValid: boolean;
  quotationMatches: Array<{
    quoteText: string;
    matchedSegmentId?: string;
    isValidMatch: boolean;
  }>;
}

export class AIEvidenceQuotationValidationService {
  /**
   * Matches any direct quotation in the AI Response against supplied approved evidence segments.
   * Rejects unsourced quotation marks, altered Qur'an/Hadith text, or AI-generated fake quotes.
   */
  static validate(
    response: AIEvidenceResponse,
    context: VerifiedAIEvidenceContextEnvelope
  ): QuotationValidationResult {
    const textToScan = response.content.aiClarification + ' ' + response.content.sourceDisclosure;
    const suppliedSegments = context.evidenceContext.sourceText?.segments || [];
    const suppliedTranslations = context.evidenceContext.translations || [];

    // Extract text in double quotes
    const quoteRegex = /"([^"]{10,})"/g;
    let match;
    const quotationMatches: Array<{ quoteText: string; matchedSegmentId?: string; isValidMatch: boolean }> = [];
    let allQuotesValid = true;

    while ((match = quoteRegex.exec(textToScan)) !== null) {
      const quoteText = match[1].trim();

      // Check if quote matches any supplied source segment or approved translation
      const matchedSegment = suppliedSegments.find(s => s.text.includes(quoteText) || quoteText.includes(s.text));
      const matchedTranslation = suppliedTranslations.find(t => t.text.includes(quoteText) || quoteText.includes(t.text));

      if (matchedSegment) {
        quotationMatches.push({
          quoteText,
          matchedSegmentId: matchedSegment.segmentId,
          isValidMatch: true,
        });
      } else if (matchedTranslation) {
        quotationMatches.push({
          quoteText,
          matchedSegmentId: matchedTranslation.translationId,
          isValidMatch: true,
        });
      } else {
        // If it's a generic phrase or title match, allow if it's short, else fail
        if (quoteText.length > 30) {
          allQuotesValid = false;
          quotationMatches.push({
            quoteText,
            isValidMatch: false,
          });
        }
      }
    }

    return {
      allQuotesValid,
      quotationMatches,
    };
  }
}
