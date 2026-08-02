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

export interface CanonicalMirathFacts {
  profile: ProfileFacts;
  estate: MirathEstateFacts;
  heirs: MirathHeirsFacts;
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

export interface CanonicalZakatFacts {
  profile: ProfileFacts;
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
}

export type AnyCanonicalFacts = CanonicalMirathFacts | CanonicalZakatFacts;
