/**
 * MIZAN — Canonical Heir Group Types (Phase 7)
 *
 * Permanent identifiers and contracts for grouping canonical heirs
 * for Hijab rules, eligibility checks, and report presentation.
 */

import type { CanonicalHeirId } from './canonical-heir.types';
import type { MadhhabCode } from '../profile.types';

export type CanonicalHeirGroupId =
  | 'SPOUSES'
  | 'PARENTS'
  | 'GRANDPARENTS'
  | 'ASCENDANTS'
  | 'IMMEDIATE_DESCENDANTS'
  | 'DESCENDANTS'
  | 'MALE_DESCENDANTS'
  | 'FEMALE_DESCENDANTS'
  | 'FULL_SIBLINGS'
  | 'PATERNAL_SIBLINGS'
  | 'MATERNAL_SIBLINGS'
  | 'SIBLINGS'
  | 'SIBLINGS_DESCENDANTS'
  | 'PATERNAL_UNCLES'
  | 'PATERNAL_UNCLES_DESCENDANTS'
  | 'COLLATERAL_RELATIVES';

export type HeirGroupMembershipMode = 'STATIC' | 'MADHHAB_SPECIFIC';

export type HeirGroupUsageScope =
  | 'HIJAB_RULE'
  | 'ELIGIBILITY_RULE'
  | 'REPORT_GROUPING';

export interface HeirGroupRecord {
  heirGroupId: CanonicalHeirGroupId;
  version: string;
  titles: {
    en: string;
    ha?: string;
    ar?: string;
    fr?: string;
    sw?: string;
  };
  membershipMode: HeirGroupMembershipMode;
  /** Heir IDs present in this group across all madhhabs */
  sharedMembers: CanonicalHeirId[];
  /** Additional or specific members per madhhab */
  madhhabMembers: Record<MadhhabCode, CanonicalHeirId[]>;
  usageScopes: HeirGroupUsageScope[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    effectiveFrom?: string;
    reviewNotes?: string;
  };
  integrity: {
    contentChecksum: string;
    updatedAt: string;
    updatedBy: string;
  };
}
