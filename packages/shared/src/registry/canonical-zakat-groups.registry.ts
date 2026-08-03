/**
 * MIZAN — Canonical Zakat Category Groups Registry (Phase 8)
 *
 * Permanent group definitions for Zakat categories.
 * Groups are used for UI section organisation and aggregation rule references.
 *
 * CRITICAL: Group membership does NOT determine zakatable status.
 * Aggregation rules are determined by the Rule Engine only.
 */

import type {
  ZakatCategoryGroupRecord,
  CanonicalZakatGroupId,
} from '../types/zakat/zakat-group.types';

const NOW = '2026-08-01T00:00:00.000Z';

function createGroup(
  groupId: CanonicalZakatGroupId,
  canonicalName: string,
  displayOrder: number,
  memberIds: string[],
  isCollapsible = true,
): ZakatCategoryGroupRecord {
  return {
    groupId,
    version: '1.0.0',
    canonicalName,
    labelKey: `zakat.group.${groupId}.label`,
    descriptionKey: `zakat.group.${groupId}.description`,
    membershipMode: 'STATIC',
    members: memberIds.map((categoryId, index) => ({
      categoryId: categoryId as any,
      displayOrder: index,
      isMandatory: true,
    })),
    displayOrder,
    isCollapsible,
    status: 'DRAFT',
  };
}

export const BASELINE_CANONICAL_ZAKAT_GROUPS: ZakatCategoryGroupRecord[] = [
  createGroup(
    'MONETARY_ASSETS',
    'Monetary and Liquid Assets',
    0,
    ['CASH_AND_BANK', 'FOREIGN_CURRENCY', 'DIGITAL_CURRENCY'],
  ),
  createGroup(
    'PRECIOUS_METALS',
    'Precious Metals',
    1,
    ['GOLD', 'SILVER'],
  ),
  createGroup(
    'TRADE_ASSETS',
    'Trade and Business Assets',
    2,
    ['BUSINESS_INVENTORY', 'BUSINESS_RECEIVABLES', 'BUSINESS_INVESTMENTS'],
  ),
  createGroup(
    'FINANCIAL_INVESTMENTS',
    'Financial Investments',
    3,
    ['QUOTED_INVESTMENTS', 'UNQUOTED_INVESTMENTS', 'PENSION_FUNDS', 'BONDS_AND_SUKUK'],
  ),
  createGroup(
    'RECEIVABLES',
    'Receivables and Loans',
    4,
    ['PERSONAL_RECEIVABLES', 'LOAN_GIVEN'],
  ),
  createGroup(
    'AGRICULTURAL',
    'Agricultural Produce',
    5,
    ['AGRICULTURAL_PRODUCE'],
  ),
  createGroup(
    'LIVESTOCK',
    'Livestock',
    6,
    ['LIVESTOCK_CAMELS', 'LIVESTOCK_CATTLE', 'LIVESTOCK_SHEEP_GOATS'],
  ),
  createGroup(
    'INCOME_AND_SAVINGS',
    'Income and Savings',
    7,
    ['RENTAL_INCOME', 'SAVINGS_DEPOSITS'],
  ),
  createGroup(
    'LIABILITIES',
    'Liabilities (Deductible)',
    8,
    ['CURRENT_LIABILITIES', 'DEFERRED_LIABILITIES'],
  ),
  createGroup(
    'ALL_ZAKATABLE_ASSETS',
    'All Potentially Zakatable Assets',
    99,
    [
      'CASH_AND_BANK', 'FOREIGN_CURRENCY', 'DIGITAL_CURRENCY',
      'GOLD', 'SILVER',
      'BUSINESS_INVENTORY', 'BUSINESS_RECEIVABLES', 'BUSINESS_INVESTMENTS',
      'QUOTED_INVESTMENTS', 'UNQUOTED_INVESTMENTS', 'PENSION_FUNDS', 'BONDS_AND_SUKUK',
      'PERSONAL_RECEIVABLES', 'LOAN_GIVEN',
      'AGRICULTURAL_PRODUCE',
      'LIVESTOCK_CAMELS', 'LIVESTOCK_CATTLE', 'LIVESTOCK_SHEEP', 'LIVESTOCK_GOATS', 'LIVESTOCK_SHEEP_GOATS', 'LIVESTOCK_MIXED_HERD', 'OTHER_LIVESTOCK_REVIEW_REQUIRED',
      'RENTAL_INCOME', 'SAVINGS_DEPOSITS',
    ],
    false,
  ),
  createGroup(
    'ALL_DEDUCTIBLE_LIABILITIES',
    'All Deductible Liabilities',
    98,
    ['CURRENT_LIABILITIES', 'DEFERRED_LIABILITIES'],
    false,
  ),
];

// ─── Index for O(1) Lookup ────────────────────────────────────────────────────

export const CANONICAL_ZAKAT_GROUP_INDEX: ReadonlyMap<CanonicalZakatGroupId, ZakatCategoryGroupRecord> =
  new Map(BASELINE_CANONICAL_ZAKAT_GROUPS.map(g => [g.groupId, g]));

/**
 * Look up a canonical Zakat category group by its permanent ID.
 */
export function getZakatGroupById(id: CanonicalZakatGroupId): ZakatCategoryGroupRecord | undefined {
  return CANONICAL_ZAKAT_GROUP_INDEX.get(id);
}
