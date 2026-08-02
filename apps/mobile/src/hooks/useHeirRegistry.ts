/**
 * MIZAN — Mobile Heir Registry Hook (Phase 7)
 *
 * Custom React hook for mobile screens to resolve canonical heir labels,
 * descriptions, and section ordering based on user's active language and madhhab.
 *
 * When user changes language:
 * - Labels update automatically
 * - Selection state and canonical fact counts remain completely unchanged
 */

import { useMemo } from 'react';
import {
  BASELINE_CANONICAL_HEIRS,
  CanonicalHeirId,
  MadhhabCode,
} from '@mizan/shared';
import { useSettingsStore } from '../stores/settings.store';

export interface MobileHeirDisplayItem {
  heirId: CanonicalHeirId;
  canonicalName: string;
  label: string;
  pluralLabel: string;
  sectionKey: string;
  maxCount: number | null;
  inputSupportStatus: string;
}

export function useHeirRegistry() {
  const madhhab = (useSettingsStore((s) => s.madhhab) ?? 'HANAFI') as MadhhabCode;
  const languageTag = useSettingsStore((s) => s.language) ?? 'en';

  const heirItems = useMemo(() => {
    return BASELINE_CANONICAL_HEIRS.map((entity) => {
      const support = entity.madhhabMetadata[madhhab]?.inputSupportStatus ?? 'SUPPORTED';
      let secKey = 'EXTENDED';
      if (entity.classification.relationshipCategory === 'SPOUSE') secKey = 'SPOUSE';
      else if (entity.heirId === 'SON' || entity.heirId === 'DAUGHTER') secKey = 'CHILDREN';
      else if (entity.heirId === 'FATHER' || entity.heirId === 'MOTHER') secKey = 'PARENTS';
      else if (entity.classification.relationshipCategory === 'ASCENDANT') secKey = 'GRANDPARENTS';
      else if (entity.classification.relationshipCategory === 'DESCENDANT') secKey = 'GRANDCHILDREN';
      else if (entity.classification.relationshipCategory === 'SIBLING') secKey = 'SIBLINGS';

      return {
        heirId: entity.heirId,
        canonicalName: entity.relationship.canonicalName,
        label: entity.relationship.canonicalName,
        pluralLabel: `${entity.relationship.canonicalName}s`,
        sectionKey: secKey,
        maxCount: entity.inputMetadata.maximumCount,
        inputSupportStatus: support,
      };
    });
  }, [madhhab, languageTag]);

  return {
    heirItems,
    madhhab,
    languageTag,
  };
}
