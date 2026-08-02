/**
 * MIZAN — Zakat Category Group Types (Phase 8)
 *
 * Permanent identifiers and contracts for grouping canonical Zakat categories
 * for aggregation rules, UI presentation, and report generation.
 *
 * CRITICAL:
 * - Group membership does NOT determine zakatable status.
 * - Aggregation rules (combining group totals for nisab) are determined by the Rule Engine.
 * - Groups are for presentation and aggregation organisation ONLY.
 */

import type { CanonicalZakatCategoryId } from './canonical-zakat-category.types';

// ─── Canonical Zakat Category Group Identifiers ───────────────────────────────

/**
 * Permanent uppercase identifiers for Zakat category groups.
 * Used to organise categories in UI sections and for nisab aggregation.
 */
export type CanonicalZakatGroupId =
  | 'MONETARY_ASSETS'          // CASH_AND_BANK, FOREIGN_CURRENCY, DIGITAL_CURRENCY
  | 'PRECIOUS_METALS'          // GOLD, SILVER
  | 'TRADE_ASSETS'             // BUSINESS_INVENTORY, BUSINESS_RECEIVABLES, BUSINESS_INVESTMENTS
  | 'FINANCIAL_INVESTMENTS'    // QUOTED_INVESTMENTS, UNQUOTED_INVESTMENTS, PENSION_FUNDS, BONDS_AND_SUKUK
  | 'RECEIVABLES'              // PERSONAL_RECEIVABLES, LOAN_GIVEN
  | 'AGRICULTURAL'             // AGRICULTURAL_PRODUCE
  | 'LIVESTOCK'                // LIVESTOCK_CAMELS, LIVESTOCK_CATTLE, LIVESTOCK_SHEEP_GOATS
  | 'INCOME_AND_SAVINGS'       // RENTAL_INCOME, SAVINGS_DEPOSITS
  | 'LIABILITIES'              // CURRENT_LIABILITIES, DEFERRED_LIABILITIES
  | 'ALL_ZAKATABLE_ASSETS'     // All assets that may be zakatable (Rule Engine determines)
  | 'ALL_DEDUCTIBLE_LIABILITIES'; // All liability categories

/** Whether group membership is fixed or varies by madhhab */
export type ZakatGroupMembershipMode =
  | 'STATIC'            // Same members for all madhhabs
  | 'MADHHAB_SPECIFIC'; // Member list differs per madhhab

/** A single member entry in a category group */
export interface ZakatGroupMemberEntry {
  categoryId: CanonicalZakatCategoryId;
  /** Display order within this group (lower = higher priority) */
  displayOrder: number;
  /** Only for MADHHAB_SPECIFIC groups: which madhhabs include this member */
  madhhabScope?: string[];
  /** Whether this is a mandatory member (vs. optional/conditional) */
  isMandatory: boolean;
}

/** Full definition of a canonical Zakat category group */
export interface ZakatCategoryGroupRecord {
  groupId: CanonicalZakatGroupId;
  /** Semantic version of this group record */
  version: string;
  /** Human-readable canonical English group name */
  canonicalName: string;
  /** i18n key for the group label */
  labelKey: string;
  /** i18n key for the group description */
  descriptionKey: string;
  /** How group membership is determined */
  membershipMode: ZakatGroupMembershipMode;
  /** Static or base membership list */
  members: ZakatGroupMemberEntry[];
  /**
   * Display order of this group in the Zakat input UI.
   * Lower numbers appear first.
   */
  displayOrder: number;
  /** Whether this group is presented as an expandable section in the UI */
  isCollapsible: boolean;
  /** Governance status */
  status: 'DRAFT' | 'APPROVED' | 'PRODUCTION' | 'DEPRECATED';
}
