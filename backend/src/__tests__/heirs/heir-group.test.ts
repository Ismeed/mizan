/**
 * MIZAN — Heir Group Tests (Phase 7)
 *
 * Tests HeirGroupRegistryService for group definitions and member resolution per madhhab.
 */

import { HeirGroupRegistryService } from '../../features/heirs/services/heir-group-registry.service';

describe('HeirGroupRegistryService', () => {

  test('loads valid canonical heir group SPOUSES', () => {
    const group = HeirGroupRegistryService.getGroup('SPOUSES');
    expect(group).not.toBeNull();
    expect(group!.heirGroupId).toBe('SPOUSES');
    expect(group!.sharedMembers).toContain('HUSBAND');
    expect(group!.sharedMembers).toContain('WIFE');
  });

  test('resolves group members for SPOUSES under HANAFI', () => {
    const members = HeirGroupRegistryService.getGroupMembers('SPOUSES', 'HANAFI');
    expect(members).toEqual(['HUSBAND', 'WIFE']);
  });

  test('resolves group members for DESCENDANTS under HANAFI', () => {
    const members = HeirGroupRegistryService.getGroupMembers('DESCENDANTS', 'HANAFI');
    expect(members).toContain('SON');
    expect(members).toContain('DAUGHTER');
    expect(members).toContain('SONS_SON');
  });

  test('returns empty array for unknown group ID', () => {
    const members = HeirGroupRegistryService.getGroupMembers('NON_EXISTENT_GROUP' as any);
    expect(members).toEqual([]);
  });

  test('lists all 16 baseline heir groups', () => {
    const groups = HeirGroupRegistryService.listGroups();
    expect(groups).toHaveLength(16);
  });
});
