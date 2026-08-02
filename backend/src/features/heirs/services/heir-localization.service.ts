/**
 * MIZAN — Heir Localization Service (Phase 7)
 *
 * Resolves localized labels and descriptions for canonical heir IDs.
 * Kept separate from Rule Engine calculation logic.
 */

import {
  BASELINE_CANONICAL_HEIRS,
  CanonicalHeirId,
  HeirLabelSet,
  SupportedHeirLanguage,
} from '@mizan/shared';
import { prisma } from '../../../config/database';

export class HeirLocalizationService {
  /**
   * Returns localized labels for a canonical heir ID in the requested language.
   * Falls back to English if the requested language is unavailable.
   */
  static async getLocalizedLabel(
    heirId: CanonicalHeirId | string,
    languageTag: SupportedHeirLanguage | string = 'en'
  ): Promise<HeirLabelSet> {
    // Try DB first
    try {
      const dbLocalization = await (prisma as any).heirLocalization.findUnique({
        where: {
          heir_id_language_tag: {
            heir_id: heirId,
            language_tag: languageTag,
          },
        },
      });

      if (dbLocalization) {
        return {
          singular: dbLocalization.singular_label,
          plural: dbLocalization.plural_label,
          shortLabel: dbLocalization.short_label ?? dbLocalization.singular_label,
          formalReportLabel: dbLocalization.formal_report_label ?? dbLocalization.singular_label,
          shortDescription: dbLocalization.short_description,
          educationalDescription: dbLocalization.educational_description ?? undefined,
          grammarNotes: dbLocalization.grammar_notes ?? undefined,
        };
      }
    } catch {
      // Fallback
    }

    // Default static dictionary fallback
    const entity = BASELINE_CANONICAL_HEIRS.find((h) => h.heirId === heirId);
    const name = entity?.relationship.canonicalName ?? heirId;

    if (languageTag === 'ar') {
      const arLabels: Record<string, { singular: string; plural: string }> = {
        HUSBAND: { singular: 'زوج', plural: 'أزواج' },
        WIFE: { singular: 'زوجة', plural: 'زوجات' },
        SON: { singular: 'ابن', plural: 'أبناء' },
        DAUGHTER: { singular: 'بنت', plural: 'بنات' },
        FATHER: { singular: 'أب', plural: 'آباء' },
        MOTHER: { singular: 'أم', plural: 'أمهات' },
        PATERNAL_GRANDFATHER: { singular: 'جد لأب', plural: 'أجداد لأب' },
        MATERNAL_GRANDFATHER: { singular: 'جد لأم', plural: 'أجداد لأم' },
        PATERNAL_GRANDMOTHER: { singular: 'جدة لأب', plural: 'جدات لأب' },
        MATERNAL_GRANDMOTHER: { singular: 'جدة لأم', plural: 'جدات لأم' },
        FULL_BROTHER: { singular: 'أخ شقيق', plural: 'إخوة أشقاء' },
        FULL_SISTER: { singular: 'أخت شقيقة', plural: 'أخوات شقيقات' },
        PATERNAL_BROTHER: { singular: 'أخ لأب', plural: 'إخوة لأب' },
        PATERNAL_SISTER: { singular: 'أخت لأب', plural: 'أخوات لأب' },
        MATERNAL_BROTHER: { singular: 'أخ لأم', plural: 'إخوة لأم' },
        MATERNAL_SISTER: { singular: 'أخت لأم', plural: 'أخوات لأم' },
      };
      if (arLabels[heirId]) {
        return {
          singular: arLabels[heirId].singular,
          plural: arLabels[heirId].plural,
          shortDescription: `صلة القرابة: ${arLabels[heirId].singular}`,
        };
      }
    }

    if (languageTag === 'ha') {
      const haLabels: Record<string, { singular: string; plural: string }> = {
        HUSBAND: { singular: 'Miji', plural: 'Miji' },
        WIFE: { singular: 'Mata', plural: 'Mata' },
        SON: { singular: 'Ɗa', plural: 'Maza' },
        DAUGHTER: { singular: '’Yarsa', plural: 'Mata' },
        FATHER: { singular: 'Uba', plural: 'Ubanni' },
        MOTHER: { singular: 'Uwa', plural: 'Uwaye' },
        FULL_BROTHER: { singular: 'Ɗan’uwa na uwa da uba', plural: '’Yan’uwa na uwa da uba' },
        FULL_SISTER: { singular: '’Yar’uwa ta uwa da uba', plural: '’Yan’uwa mata' },
      };
      if (haLabels[heirId]) {
        return {
          singular: haLabels[heirId].singular,
          plural: haLabels[heirId].plural,
          shortDescription: `Dangantaka: ${haLabels[heirId].singular}`,
        };
      }
    }

    // Default English
    return {
      singular: name,
      plural: `${name}s`,
      shortLabel: name,
      formalReportLabel: name,
      shortDescription: `Relationship: ${name}`,
    };
  }
}
