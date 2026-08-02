/**
 * MIZAN — Zakat Category Group Registry Tests (Phase 8)
 *
 * Validates the canonical Zakat category group registry.
 */

import {
  BASELINE_CANONICAL_ZAKAT_GROUPS,
  CANONICAL_ZAKAT_GROUP_INDEX,
  getZakatGroupById,
  BASELINE_CANONICAL_ZAKAT_CATEGORIES,
} from '@mizan/shared';

describe('Canonical Zakat Category Group Registry', () => {
  test('Registry contains 11 groups', () => {
    expect(BASELINE_CANONICAL_ZAKAT_GROUPS.length).toBe(11);
  });

  test('All group IDs are unique', () => {
    const ids = BASELINE_CANONICAL_ZAKAT_GROUPS.map(g => g.groupId);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('All groups have a DRAFT governance status', () => {
    for (const group of BASELINE_CANONICAL_ZAKAT_GROUPS) {
      expect(group.status).toBe('DRAFT');
    }
  });

  test('MONETARY_ASSETS group contains CASH_AND_BANK', () => {
    const group = getZakatGroupById('MONETARY_ASSETS');
    expect(group).toBeDefined();
    const memberIds = group!.members.map(m => m.categoryId);
    expect(memberIds).toContain('CASH_AND_BANK');
  });

  test('PRECIOUS_METALS group contains GOLD and SILVER', () => {
    const group = getZakatGroupById('PRECIOUS_METALS');
    expect(group).toBeDefined();
    const memberIds = group!.members.map(m => m.categoryId);
    expect(memberIds).toContain('GOLD');
    expect(memberIds).toContain('SILVER');
  });

  test('LIVESTOCK group contains all three livestock categories', () => {
    const group = getZakatGroupById('LIVESTOCK');
    expect(group).toBeDefined();
    const memberIds = group!.members.map(m => m.categoryId);
    expect(memberIds).toContain('LIVESTOCK_CAMELS');
    expect(memberIds).toContain('LIVESTOCK_CATTLE');
    expect(memberIds).toContain('LIVESTOCK_SHEEP_GOATS');
  });

  test('LIABILITIES group contains CURRENT_LIABILITIES and DEFERRED_LIABILITIES', () => {
    const group = getZakatGroupById('LIABILITIES');
    expect(group).toBeDefined();
    const memberIds = group!.members.map(m => m.categoryId);
    expect(memberIds).toContain('CURRENT_LIABILITIES');
    expect(memberIds).toContain('DEFERRED_LIABILITIES');
  });

  test('ALL_ZAKATABLE_ASSETS group contains all non-liability categories', () => {
    const group = getZakatGroupById('ALL_ZAKATABLE_ASSETS');
    expect(group).toBeDefined();
    const memberIds = new Set(group!.members.map(m => m.categoryId));
    const nonLiabilityCategories = BASELINE_CANONICAL_ZAKAT_CATEGORIES
      .filter(c => !c.classification.isLiability)
      .map(c => c.categoryId);
    for (const catId of nonLiabilityCategories) {
      expect(memberIds).toContain(catId);
    }
  });

  test('getZakatGroupById returns undefined for unknown group', () => {
    const result = getZakatGroupById('UNKNOWN_GROUP' as any);
    expect(result).toBeUndefined();
  });

  test('All group member category IDs are valid canonical IDs', () => {
    const allCategoryIds = new Set(BASELINE_CANONICAL_ZAKAT_CATEGORIES.map(c => c.categoryId));
    for (const group of BASELINE_CANONICAL_ZAKAT_GROUPS) {
      for (const member of group.members) {
        expect(allCategoryIds.has(member.categoryId as any)).toBe(true);
      }
    }
  });

  test('Groups are ordered by displayOrder', () => {
    const sorted = [...BASELINE_CANONICAL_ZAKAT_GROUPS].sort((a, b) => a.displayOrder - b.displayOrder);
    const original = BASELINE_CANONICAL_ZAKAT_GROUPS;
    // Non-meta groups (displayOrder < 90) should be sequential
    const nonMeta = sorted.filter(g => g.displayOrder < 90);
    for (let i = 1; i < nonMeta.length; i++) {
      expect(nonMeta[i].displayOrder).toBeGreaterThanOrEqual(nonMeta[i - 1].displayOrder);
    }
  });
});
