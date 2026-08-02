/**
 * MIZAN — Baseline Canonical Heir Groups Registry (Phase 7)
 *
 * Technical group definitions for Hijab rules, eligibility evaluation,
 * and UI/report section grouping.
 */

import type { HeirGroupRecord, CanonicalHeirGroupId } from '../types/heir/heir-group.types';
import type { CanonicalHeirId } from '../types/heir/canonical-heir.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'c'.repeat(64);

function createGroupRecord(
  heirGroupId: CanonicalHeirGroupId,
  titleEn: string,
  titleAr: string,
  sharedMembers: CanonicalHeirId[],
  jafariOverrides: CanonicalHeirId[] = []
): HeirGroupRecord {
  return {
    heirGroupId,
    version: '1.0.0',
    titles: {
      en: titleEn,
      ar: titleAr,
    },
    membershipMode: jafariOverrides.length > 0 ? 'MADHHAB_SPECIFIC' : 'STATIC',
    sharedMembers,
    madhhabMembers: {
      HANAFI: sharedMembers,
      MALIKI: sharedMembers,
      SHAFII: sharedMembers,
      HANBALI: sharedMembers,
      JAFARI: jafariOverrides.length > 0 ? jafariOverrides : sharedMembers,
    },
    usageScopes: ['HIJAB_RULE', 'ELIGIBILITY_RULE', 'REPORT_GROUPING'],
    governance: {
      status: 'APPROVED',
      effectiveFrom: NOW,
    },
    integrity: {
      contentChecksum: CHECKSUM,
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  };
}

export const BASELINE_CANONICAL_HEIR_GROUPS: HeirGroupRecord[] = [
  createGroupRecord('SPOUSES', 'Spouses', 'الزوجان', ['HUSBAND', 'WIFE']),
  createGroupRecord('PARENTS', 'Parents', 'الأبوان', ['FATHER', 'MOTHER']),
  createGroupRecord('GRANDPARENTS', 'Grandparents', 'الأجداد والجدات', ['PATERNAL_GRANDFATHER', 'MATERNAL_GRANDFATHER', 'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER']),
  createGroupRecord('ASCENDANTS', 'Ascendants', 'الأصول', ['FATHER', 'MOTHER', 'PATERNAL_GRANDFATHER', 'MATERNAL_GRANDFATHER', 'PATERNAL_GRANDMOTHER', 'MATERNAL_GRANDMOTHER']),
  createGroupRecord('IMMEDIATE_DESCENDANTS', 'Immediate Descendants', 'الفروع المباشرون', ['SON', 'DAUGHTER']),
  createGroupRecord('DESCENDANTS', 'Descendants', 'الفروع', ['SON', 'DAUGHTER', 'SONS_SON', 'SONS_DAUGHTER', 'SONS_SONS_SON', 'SONS_SONS_DAUGHTER']),
  createGroupRecord('MALE_DESCENDANTS', 'Male Descendants', 'الفروع الذكور', ['SON', 'SONS_SON', 'SONS_SONS_SON']),
  createGroupRecord('FEMALE_DESCENDANTS', 'Female Descendants', 'الفروع الإناث', ['DAUGHTER', 'SONS_DAUGHTER', 'SONS_SONS_DAUGHTER']),
  createGroupRecord('FULL_SIBLINGS', 'Full Siblings', 'الإخوة الأشقاء', ['FULL_BROTHER', 'FULL_SISTER']),
  createGroupRecord('PATERNAL_SIBLINGS', 'Paternal Siblings', 'الإخوة لأب', ['PATERNAL_BROTHER', 'PATERNAL_SISTER']),
  createGroupRecord('MATERNAL_SIBLINGS', 'Maternal Siblings', 'الإخوة لأم', ['MATERNAL_BROTHER', 'MATERNAL_SISTER', 'MATERNAL_HALF_SIBLING']),
  createGroupRecord('SIBLINGS', 'Siblings', 'الإخوة مطلقاً', ['FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER', 'MATERNAL_HALF_SIBLING']),
  createGroupRecord('SIBLINGS_DESCENDANTS', "Siblings' Descendants", 'أبناء الإخوة', ['FULL_BROTHERS_SON', 'FULL_BROTHERS_SONS_SON', 'PATERNAL_BROTHERS_SON', 'PATERNAL_BROTHERS_SONS_SON']),
  createGroupRecord('PATERNAL_UNCLES', 'Paternal Uncles', 'العمومة', ['FATHERS_FULL_BROTHER', 'FATHERS_PATERNAL_BROTHER']),
  createGroupRecord('PATERNAL_UNCLES_DESCENDANTS', "Paternal Uncles' Descendants", 'أبناء العمومة', ['FATHERS_FULL_BROTHERS_SON', 'FATHERS_FULL_BROTHERS_SONS_SON', 'FATHERS_PATERNAL_BROTHERS_SON', 'FATHERS_PATERNAL_BROTHERS_SONS_SON']),
  createGroupRecord('COLLATERAL_RELATIVES', 'Collateral Relatives', 'الحواشي', [
    'FULL_BROTHER', 'FULL_SISTER', 'PATERNAL_BROTHER', 'PATERNAL_SISTER', 'MATERNAL_BROTHER', 'MATERNAL_SISTER',
    'FULL_BROTHERS_SON', 'PATERNAL_BROTHERS_SON', 'FATHERS_FULL_BROTHER', 'FATHERS_PATERNAL_BROTHER',
  ]),
];
