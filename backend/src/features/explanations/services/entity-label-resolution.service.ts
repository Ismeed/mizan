/**
 * Entity Label Resolution Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import {
  BASELINE_CANONICAL_HEIRS,
  BASELINE_CANONICAL_ZAKAT_CATEGORIES,
  BASELINE_AGRICULTURE_PRODUCE_TYPES,
} from '@mizan/shared';

export class EntityLabelResolutionService {
  public static resolveEntityLabel(
    entityId: string,
    valueType: string,
    languageTag: string
  ): string {
    if (valueType === 'ENTITY_LABEL') {
      // Check heir registry
      const heir = BASELINE_CANONICAL_HEIRS.find((h) => h.heirId === entityId);
      if (heir) {
        const loc = (heir as any).localization;
        if (loc && loc[languageTag] && loc[languageTag].canonicalLabel) {
          return loc[languageTag].canonicalLabel;
        }
        return heir.relationship?.canonicalName || heir.heirId || entityId;
      }

      // Check Madhhab names
      const madhhabLabels: Record<string, Record<string, string>> = {
        HANAFI: { en: 'Hanafi', ha: 'Hanafi', ar: 'الحنفي' },
        MALIKI: { en: 'Maliki', ha: 'Maliki', ar: 'المالكي' },
        SHAFII: { en: 'Shafi’i', ha: 'Shafi’i', ar: 'الشافعي' },
        HANBALI: { en: 'Hanbali', ha: 'Hanbali', ar: 'الحنبلي' },
        JAFARI: { en: 'Ja’fari', ha: 'Ja’fari', ar: 'الجعفري' },
      };

      if (madhhabLabels[entityId]) {
        return madhhabLabels[entityId][languageTag] || madhhabLabels[entityId]['en'] || entityId;
      }
    }

    if (valueType === 'CATEGORY_LABEL') {
      // Check Zakat categories
      const category = BASELINE_CANONICAL_ZAKAT_CATEGORIES.find((c) => c.categoryId === entityId);
      if (category) {
        const loc = (category as any).localization;
        if (loc && loc[languageTag] && loc[languageTag].canonicalLabel) {
          return loc[languageTag].canonicalLabel;
        }
        return category.canonicalName || category.categoryId || entityId;
      }

      // Check Produce types
      const produce = BASELINE_AGRICULTURE_PRODUCE_TYPES.find((p) => p.produceTypeId === entityId);
      if (produce) {
        return produce.canonicalName || produce.produceTypeId || entityId;
      }
    }

    return entityId;
  }
}
