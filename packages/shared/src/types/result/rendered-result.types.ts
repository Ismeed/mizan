/**
 * MIZAN — Rendered Calculation Result Contract (Phase 13)
 * Changing language or presentation preferences creates a different rendering,
 * NOT a different authoritative calculation result.
 */

import type { TextDirection } from '../profile.types';

export interface LocalizedSubjectRender {
  subjectId: string;
  localizedName: string;
  localizedDescription?: string;
}

export interface RenderedResultExplanation {
  explanationId: string;
  localizedText: string;
  audienceType: string;
}

export interface FormattedValue {
  valueId: string;
  formattedString: string;
  displayMode: string;
}

export interface FormattedEvidenceCitation {
  evidenceId: string;
  formattedCitation: string;
}

export interface RenderedCalculationResult {
  authoritativeResultId: string;
  renderedResultId: string;
  language: {
    languageTag: string;
    locale: string;
    direction: TextDirection;
  };
  localizedSubjects: Record<string, LocalizedSubjectRender>;
  renderedExplanations: Record<string, RenderedResultExplanation>;
  formattedValues: Record<string, FormattedValue>;
  formattedEvidenceCitations: Record<string, FormattedEvidenceCitation>;
  translationFallbacks: string[];
  renderedChecksum: string;
}
