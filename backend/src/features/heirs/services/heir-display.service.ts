/**
 * MIZAN — Heir Display Service (Phase 7)
 *
 * Provides controlled section ordering and UI display items for the heir selection screen.
 * Changing display order does NOT affect Rule Engine behavior.
 */

import {
  BASELINE_CANONICAL_HEIRS,
  CanonicalHeirId,
  MadhhabCode,
  SupportedHeirLanguage,
} from '@mizan/shared';
import { HeirLocalizationService } from './heir-localization.service';

export interface HeirDisplayItem {
  heirId: CanonicalHeirId;
  canonicalName: string;
  localizedLabel: string;
  localizedPlural: string;
  shortDescription: string;
  sectionKey: string;
  displayOrder: number;
  maxCount: number | null;
  inputSupportStatus: string;
}

export interface HeirDisplaySection {
  sectionKey: string;
  titleEn: string;
  titleAr: string;
  titleHa: string;
  displayOrder: number;
  items: HeirDisplayItem[];
}

export class HeirDisplayService {
  /**
   * Builds the complete set of ordered display sections for the heir selection screen.
   */
  static async getDisplaySections(
    madhhab: MadhhabCode = 'HANAFI',
    languageTag: SupportedHeirLanguage = 'en'
  ): Promise<HeirDisplaySection[]> {
    const sections: Record<string, { titleEn: string; titleAr: string; titleHa: string; order: number }> = {
      SPOUSE: { titleEn: '1. Spouse', titleAr: '١. الزوجان', titleHa: '1. Miji / Mata', order: 1 },
      CHILDREN: { titleEn: '2. Children', titleAr: '٢. الأولاد', titleHa: '2. Yara', order: 2 },
      PARENTS: { titleEn: '3. Parents', titleAr: '٣. الأبوان', titleHa: '3. Uba da Uwa', order: 3 },
      GRANDPARENTS: { titleEn: '4. Grandparents', titleAr: '٤. الأجداد والجدات', titleHa: '4. Kaka', order: 4 },
      GRANDCHILDREN: { titleEn: '5. Grandchildren', titleAr: '٥. الأحفاد', titleHa: '5. Jikoki', order: 5 },
      SIBLINGS: { titleEn: '6. Siblings', titleAr: '٦. الإخوة والأخوات', titleHa: '6. ’Yan’uwa', order: 6 },
      EXTENDED: { titleEn: '7. Extended Relatives', titleAr: '٧. الأقارب الآخرون', titleHa: '7. Sauran Dangi', order: 7 },
    };

    const sectionMap = new Map<string, HeirDisplayItem[]>();
    for (const key of Object.keys(sections)) {
      sectionMap.set(key, []);
    }

    for (const entity of BASELINE_CANONICAL_HEIRS) {
      const labels = await HeirLocalizationService.getLocalizedLabel(entity.heirId, languageTag);
      const support = entity.madhhabMetadata[madhhab]?.inputSupportStatus ?? 'SUPPORTED';

      let secKey = 'EXTENDED';
      if (entity.classification.relationshipCategory === 'SPOUSE') secKey = 'SPOUSE';
      else if (entity.heirId === 'SON' || entity.heirId === 'DAUGHTER') secKey = 'CHILDREN';
      else if (entity.heirId === 'FATHER' || entity.heirId === 'MOTHER') secKey = 'PARENTS';
      else if (entity.classification.relationshipCategory === 'ASCENDANT') secKey = 'GRANDPARENTS';
      else if (entity.classification.relationshipCategory === 'DESCENDANT') secKey = 'GRANDCHILDREN';
      else if (entity.classification.relationshipCategory === 'SIBLING') secKey = 'SIBLINGS';

      const item: HeirDisplayItem = {
        heirId: entity.heirId,
        canonicalName: entity.relationship.canonicalName,
        localizedLabel: labels.singular,
        localizedPlural: labels.plural,
        shortDescription: labels.shortDescription,
        sectionKey: secKey,
        displayOrder: entity.classification.generationDistance,
        maxCount: entity.inputMetadata.maximumCount,
        inputSupportStatus: support,
      };

      if (!sectionMap.has(secKey)) sectionMap.set(secKey, []);
      sectionMap.get(secKey)!.push(item);
    }

    const result: HeirDisplaySection[] = [];
    for (const [key, config] of Object.entries(sections)) {
      result.push({
        sectionKey: key,
        titleEn: config.titleEn,
        titleAr: config.titleAr,
        titleHa: config.titleHa,
        displayOrder: config.order,
        items: sectionMap.get(key) ?? [],
      });
    }

    return result.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}
