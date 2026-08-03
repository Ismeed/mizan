/**
 * MIZAN — Report Evidence Presentation Contract (Phase 14)
 */

export interface FormattedReportEvidence {
  evidenceId: string;
  evidenceVersion: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_TEXT' | 'SCHOLARLY_CONSENSUS' | 'EXPLANATORY_NOTE';
  orderIndex: number;
  sourceTitle: string;
  citationReference: string; // e.g. "Surah An-Nisa 4:11" or "Sahih al-Bukhari 6735"
  originalArabicText?: string | null;
  translatedText: string;
  shortCitation: string;
  supportedDecisionCode: string;
  supportedResultItemId: string;
  selectedMadhhabRelevance?: string | null;
  clickableAction?: {
    actionType: 'OPEN_EVIDENCE_DETAIL' | 'ASK_MIZAN_AI';
    payload: Record<string, unknown>;
  };
}
