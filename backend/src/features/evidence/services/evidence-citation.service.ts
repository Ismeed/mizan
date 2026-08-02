import { BaseEvidence, EvidenceType, EvidenceCitationDisplay } from '@mizan/shared';

export class EvidenceCitationService {
  /**
   * Deterministically formats citations for all 6 application contexts.
   */
  static formatCitation(
    evidence: BaseEvidence,
    selectedLanguage: string = 'en',
    selectedMadhhab: string = 'HANAFI'
  ): EvidenceCitationDisplay {
    const lang = selectedLanguage.toLowerCase();
    const type = evidence.evidenceType;

    let shortRef = evidence.identity.shortReference;
    let fullRef = evidence.identity.canonicalReference;

    // Qur'an custom citation formatting
    if (type === EvidenceType.QURAN && (evidence as any).reference) {
      const ref = (evidence as any).reference;
      const surahName = ref.surahNames?.[lang] || ref.surahNames?.en || ref.surahNameArabic;
      if (ref.ayahStart === ref.ayahEnd) {
        shortRef = `Quran ${ref.surahNumber}:${ref.ayahStart}`;
        fullRef = `Surah ${surahName}, ${ref.surahNumber}:${ref.ayahStart}`;
      } else {
        shortRef = `Quran ${ref.surahNumber}:${ref.ayahStart}-${ref.ayahEnd}`;
        fullRef = `Surah ${surahName}, ${ref.surahNumber}:${ref.ayahStart}-${ref.ayahEnd}`;
      }
    }

    // Hadith custom citation formatting
    if (type === EvidenceType.HADITH && (evidence as any).reference) {
      const ref = (evidence as any).reference;
      const colName = ref.collectionNames?.[lang] || ref.collectionNames?.en || ref.collectionId;
      shortRef = `${colName} ${ref.canonicalHadithNumber}`;
      fullRef = `${colName}, Hadith ${ref.canonicalHadithNumber}`;
    }

    // Extract approved translation text
    const translations = evidence.translations || {};
    const selectedTrans = translations[lang] || translations['en'] || Object.values(translations)[0] || {};
    const translationText = typeof selectedTrans === 'string' ? selectedTrans : selectedTrans.text || '';
    const attributionText = selectedTrans.attributionText || selectedTrans.translator || evidence.sourceProvenance?.publisher;

    // Extract original text
    const content = evidence.content || {};
    const originalText = content.arabicText || content.originalText || content.matnText || '';

    // Madhhab scope validation check
    const madhhabScope = evidence.madhhabScope || { mode: 'SHARED', appliesTo: [] };
    const scopeValidated =
      madhhabScope.mode === 'SHARED' ||
      (Array.isArray(madhhabScope.appliesTo) && madhhabScope.appliesTo.includes(selectedMadhhab.toUpperCase() as any));

    return {
      evidenceId: evidence.evidenceId,
      evidenceVersion: evidence.version,
      evidenceType: type,
      reference: {
        short: shortRef,
        full: fullRef,
        academic: `${fullRef}. (${evidence.sourceProvenance?.publisher || 'MIZAN Sharia Knowledge Base'})`,
        pdf: `${fullRef} [Ref: ${evidence.evidenceId}]`,
      },
      content: {
        originalText,
        approvedTranslation: translationText,
        translationLanguage: lang,
        approvedExplanation: content.approvedExplanation || content.approvedSummary,
        attributionText,
      },
      madhhab: {
        selected: selectedMadhhab,
        scopeValidated,
      },
      actions: {
        canOpenAIExplanation: true,
        canViewSourceDetails: true,
        canCopyReference: true,
      },
    };
  }
}
