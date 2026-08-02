/**
 * MIZAN — Heir Group Registry Service (Phase 7)
 *
 * Resolves technical heir group definitions (e.g. SPOUSES, PARENTS, DESCENDANTS)
 * and resolves member heir IDs per madhhab.
 */

import {
  BASELINE_CANONICAL_HEIR_GROUPS,
  CanonicalHeirGroupId,
  CanonicalHeirId,
  HeirGroupRecord,
  MadhhabCode,
} from '@mizan/shared';

export class HeirGroupRegistryService {
  /**
   * Retrieves a canonical heir group definition by ID.
   */
  static getGroup(groupId: CanonicalHeirGroupId | string): HeirGroupRecord | null {
    const group = BASELINE_CANONICAL_HEIR_GROUPS.find((g) => g.heirGroupId === groupId);
    return group ?? null;
  }

  /**
   * Returns all canonical heir group definitions.
   */
  static listGroups(): HeirGroupRecord[] {
    return BASELINE_CANONICAL_HEIR_GROUPS;
  }

  /**
   * Resolves the member Canonical Heir IDs for a given group and madhhab.
   */
  static getGroupMembers(
    groupId: CanonicalHeirGroupId | string,
    madhhab: MadhhabCode = 'HANAFI'
  ): CanonicalHeirId[] {
    const group = HeirGroupRegistryService.getGroup(groupId);
    if (!group) return [];

    if (group.membershipMode === 'MADHHAB_SPECIFIC' && group.madhhabMembers[madhhab]) {
      return group.madhhabMembers[madhhab];
    }
    return group.sharedMembers;
  }
}
