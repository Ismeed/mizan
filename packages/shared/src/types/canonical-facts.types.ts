/**
 * MIZAN — Canonical Fact Model
 *
 * The normalized, flat fact object that every rule condition references.
 * All condition factsPath values must resolve to a leaf of these interfaces.
 *
 * IMPORTANT: This is the authoritative input contract for rule matching.
 * Rule conditions must reference `facts.*` paths defined here.
 * UI labels, user-facing strings, and display-only fields are excluded.
 */

import { Madhhab } from './inheritance.types';
import type { CanonicalZakatCategoryId } from './zakat/canonical-zakat-category.types';

// ─── Calculation Profile Subset ───────────────────────────────────────────────

export interface ProfileFacts {
  madhhab: Madhhab;
  currencyCode: string;
  region?: string;
  knowledgeReleaseVersion: string;
}

// ─── Mirath Facts ─────────────────────────────────────────────────────────────

export interface HeirFacts {
  count: number;
  isPresent: boolean;
}

export interface MirathEstateFacts {
  netDistributableAmount: number;
  currency: string;
  hasDebts: boolean;
  debtAmount: number;
  hasFuneralExpenses: boolean;
  funeralExpenseAmount: number;
  hasWasiyyah: boolean;
  wasiyyahAmount: number;
}

export interface MirathHeirsFacts {
  husband:               HeirFacts;
  wives:                 HeirFacts;
  sons:                  HeirFacts;
  daughters:             HeirFacts;
  father:                HeirFacts;
  mother:                HeirFacts;
  paternalGrandfathers:  HeirFacts;
  paternalGrandmothers:  HeirFacts;
  maternalGrandmothers:  HeirFacts;
  fullBrothers:          HeirFacts;
  fullSisters:           HeirFacts;
  paternalHalfBrothers:  HeirFacts;
  paternalHalfSisters:   HeirFacts;
  maternalHalfSiblings:  HeirFacts;
  sonsOfFullBrothers:    HeirFacts;
  sonsOfPatHalfBrothers: HeirFacts;
  paternalUncles:        HeirFacts;
  sonsOfPatUncles:       HeirFacts;
}

import { CanonicalHeirId } from './heir/canonical-heir.types';

export interface CanonicalHeirFactsMap {
  [heirId: string]: HeirFacts;
}

export interface CanonicalMirathFacts {
  profile: ProfileFacts;
  estate: MirathEstateFacts;
  /** Legacy camelCase heirs map (kept for backward compatibility) */
  heirs: MirathHeirsFacts;
  /** Phase 7 Canonical ID heir facts map (keyed by permanent uppercase CanonicalHeirId) */
  canonicalHeirs?: Record<CanonicalHeirId, HeirFacts>;
  /** Computed meta-facts derived from heirs */
  computed: {
    hasChildren: boolean;
    hasMaleLineDescendants: boolean;
    hasSiblings: boolean;
    hasSpouse: boolean;
    hasAscendants: boolean;
  };
}

// ─── Zakat Facts ──────────────────────────────────────────────────────────────

export interface ZakatAssetFacts {
  amount: number;
  isPresent: boolean;
  isZakatable?: boolean;
  irrigationMethod?: 'RAIN_FED' | 'IRRIGATION';
  /** Whether hawl has been met for this specific asset entry */
  hawlMet?: boolean;
}

export interface ZakatNisabFacts {
  goldGramPrice: number;
  silverGramPrice: number;
  goldNisabGrams: number;
  silverNisabGrams: number;
  goldNisabValueInCurrency: number;
  silverNisabValueInCurrency: number;
  hawlMet: boolean;
}

/**
 * Phase 8 Canonical ID-keyed Zakat asset facts map.
 * Keyed by permanent CanonicalZakatCategoryId.
 * This is the AUTHORITATIVE representation for the Rule Engine.
 */
export interface CanonicalZakatAssetFactsMap {
  [categoryId: string]: ZakatAssetFacts;
}

export interface CanonicalZakatFacts {
  profile: ProfileFacts;
  /**
   * Legacy named assets map (kept for backward compatibility).
   * @deprecated Use canonicalAssets (keyed by CanonicalZakatCategoryId) instead.
   * Will be removed after all screens migrate to canonical IDs.
   */
  assets: {
    cash:              ZakatAssetFacts;
    gold:              ZakatAssetFacts;
    silver:            ZakatAssetFacts;
    businessInventory: ZakatAssetFacts;
    investments:       ZakatAssetFacts;
    receivables:       ZakatAssetFacts;
    agriculture:       ZakatAssetFacts;
    livestock:         ZakatAssetFacts;
  };
  /**
   * Phase 8 Canonical ID-keyed Zakat asset facts map.
   * Keys are permanent CanonicalZakatCategoryId values (e.g. 'CASH_AND_BANK', 'GOLD').
   * This is the authoritative input for all new Rule Engine conditions and services.
   */
  canonicalAssets?: Record<CanonicalZakatCategoryId, ZakatAssetFacts>;
  liabilities: {
    totalLiabilities: number;
    shortTermDebts:   number;
  };
  nisab: ZakatNisabFacts;
  computed: {
    totalZakatableWealth: number;
    netZakatableWealth:   number;
    meetsNisabGold:       boolean;
    meetsNisabSilver:     boolean;
    meetsNisabLower:      boolean;
  };
  /** Registry version used when these facts were compiled */
  zakatCategoryRegistryVersion?: string;
}

export type AnyCanonicalFacts = CanonicalMirathFacts | CanonicalZakatFacts;

