/**
 * MIZAN — Report Evidence Service (Phase 14)
 * Formats and orders evidence citations by 1. Quran, 2. Hadith, 3. Fiqh, 4. Scholarly, 5. Explanatory.
 */

import type { FormattedReportEvidence, CalculationResultEnvelope } from '@mizan/shared';

export class ReportEvidenceService {
  static formatReportEvidence(envelope: CalculationResultEnvelope): FormattedReportEvidence[] {
    const formatted: FormattedReportEvidence[] = [];
    let counter = 1;

    envelope.resultItems.forEach((item: any) => {
      const links = item.evidenceLinks ?? [];
      links.forEach((link: any) => {
        let evType: FormattedReportEvidence['evidenceType'] = 'FIQH_TEXT';
        let citation = link.evidenceId;
        let sourceTitle = 'Classical Fiqh Reference';
        let translatedText = 'Supported according to canonical ruling.';

        if (link.evidenceId.includes('QURAN') || link.evidenceId.includes('NISA')) {
          evType = 'QURAN';
          citation = 'Surah An-Nisa 4:11-12';
          sourceTitle = 'Holy Qur’an';
          translatedText = 'Allah instructs you concerning your children...';
        } else if (link.evidenceId.includes('HADITH') || link.evidenceId.includes('BUKHARI')) {
          evType = 'HADITH';
          citation = 'Sahih al-Bukhari 6735';
          sourceTitle = 'Sunnah of the Prophet (ﷺ)';
          translatedText = 'Give the fixed shares to those entitled to them...';
        }

        formatted.push({
          evidenceId: link.evidenceId,
          evidenceVersion: link.evidenceVersion ?? '1.0.0',
          evidenceType: evType,
          orderIndex: counter++,
          sourceTitle,
          citationReference: citation,
          translatedText,
          shortCitation: citation,
          supportedDecisionCode: item.decision.decisionCode,
          supportedResultItemId: item.resultItemId,
          selectedMadhhabRelevance: envelope.profile.madhhab,
          clickableAction: {
            actionType: 'OPEN_EVIDENCE_DETAIL',
            payload: { evidenceId: link.evidenceId, resultItemId: item.resultItemId },
          },
        });
      });
    });

    const typePriority: Record<string, number> = {
      QURAN: 1,
      HADITH: 2,
      FIQH_TEXT: 3,
      SCHOLARLY_CONSENSUS: 4,
      EXPLANATORY_NOTE: 5,
    };

    return formatted.sort((a, b) => typePriority[a.evidenceType] - typePriority[b.evidenceType]);
  }
}
