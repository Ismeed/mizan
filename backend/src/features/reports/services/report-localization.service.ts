/**
 * MIZAN — Report Localization Service (Phase 14)
 * Resolves section titles and field labels into localized strings for rendering.
 * Does NOT alter internal canonical section IDs or decision codes.
 */

export class ReportLocalizationService {
  private static titleTranslations: Record<string, Record<string, string>> = {
    REPORT_IDENTITY: {
      en: 'SECTION 01 — REPORT IDENTITY',
      ha: 'SASHE NA 01 — SHAIDAR RAHOTO',
      ar: 'القسم 01 — هُويَّةُ التَّقْرِيرِ',
    },
    CALCULATION_PROFILE: {
      en: 'SECTION 02 — CALCULATION PROFILE',
      ha: 'SASHE NA 02 — TSARIN LISAFIN',
      ar: 'القسم 02 — مَلَفُّ الحِسَابِ',
    },
    INPUT_SUMMARY: {
      en: 'SECTION 03 — INPUT SUMMARY',
      ha: 'SASHE NA 03 — TAKAITACCEN BAYANAN SHIGARWA',
      ar: 'القسم 03 — مُلَخَّصُ البَيَانَاتِ المدخلة',
    },
    VALIDATION_AND_SCOPE: {
      en: 'SECTION 04 — VALIDATION AND CALCULATION SCOPE',
      ha: 'SASHE NA 04 — TABBATARWA DA FAHYAR LISAFIN',
      ar: 'القسم 04 — التَّحَقُّقُ وَنِطَاقُ الحِسَابِ',
    },
    RESULT_SUMMARY: {
      en: 'SECTION 05 — RESULT SUMMARY',
      ha: 'SASHE NA 05 — TAKAITACCEN SAKAMAKO',
      ar: 'القسم 05 — مُلَخَّصُ النَّتِيجَةِ',
    },
    DETAILED_BREAKDOWN: {
      en: 'SECTION 06 — DETAILED CALCULATION BREAKDOWN',
      ha: 'SASHE NA 06 — CIKAKKEN RABA SAKAMAKO',
      ar: 'القسم 06 — التَّفْصِيلُ الدَّقِيقُ لِلْحِسَابِ',
    },
    EXCLUDED_AND_REVIEW_ITEMS: {
      en: 'SECTION 07 — EXCLUDED, BLOCKED, NOT-DUE, OR REVIEW-REQUIRED ITEMS',
      ha: 'SASHE NA 07 — ABUBUWAN DA AKA KADA KO AKA DAGE',
      ar: 'القسم 07 — العَنَاصِرُ المَحْجُوبَةُ وَالمُسْتَبْعَدَةُ',
    },
    EVIDENCE_AND_EXPLANATIONS: {
      en: 'SECTION 08 — EVIDENCE AND EXPLANATIONS',
      ha: 'SASHE NA 08 — SHAHADU DA BAYANI',
      ar: 'القسم 08 — الأَدِلَّةُ وَالشُّرُوحُ',
    },
    TOTALS_AND_RECONCILIATION: {
      en: 'SECTION 09 — TOTALS AND RECONCILIATION',
      ha: 'SASHE NA 09 — JIMULLA DA DAITAWA',
      ar: 'القسم 09 — الإِجْمَالِيُّ وَالمُقَارَبَةُ',
    },
    WARNINGS_AND_ACTIONS: {
      en: 'SECTION 10 — WARNINGS, LIMITATIONS, AND REQUIRED ACTIONS',
      ha: 'SASHE NA 10 — GARGADI DA MATANGAUTA',
      ar: 'القسم 10 — التَّحْذِيرَاتُ وَالإِجْرَاءَاتُ المَطْلُوبَةُ',
    },
    TECHNICAL_AND_AUDIT_DETAILS: {
      en: 'SECTION 11 — TECHNICAL AND AUDIT DETAILS',
      ha: 'SASHE NA 11 — BAYANIN FASAHA DA AUDIT',
      ar: 'القسم 11 — التَّفَاصِيلُ الفَنِّيَّةُ وَالتَّدْقِيقُ',
    },
    DECLARATION_AND_CLOSING: {
      en: 'SECTION 12 — REPORT DECLARATION AND CLOSING INFORMATION',
      ha: 'SASHE NA 12 — KARSHE DA SANARWAR RAHOTO',
      ar: 'القسم 12 — الإِقْرَارُ وَالخَاتِمَةُ',
    },
  };

  static resolveSectionTitle(sectionId: string, lang = 'en'): string {
    const langKey = lang.startsWith('ar') ? 'ar' : lang.startsWith('ha') ? 'ha' : 'en';
    return this.titleTranslations[sectionId]?.[langKey] ?? sectionId;
  }
}
