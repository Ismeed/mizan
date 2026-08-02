/**
 * MIZAN — Zakat Asset Instance & Normalization Contract (Phase 8)
 *
 * Represents a single Zakat asset entry in a specific calculation case,
 * and the output of the ZakatAssetNormalizationService.
 *
 * CRITICAL:
 * - An asset instance records what the user entered and its canonical ID.
 * - Whether the asset is zakatable is determined by the Rule Engine, not here.
 * - Raw user input and canonical ID must be stored separately.
 */

import type { CanonicalZakatCategoryId } from './canonical-zakat-category.types';
import type { HawlRecord } from './zakat-nisab.types';
import type { ZakatCategoryNormalizationResult } from './zakat-alias.types';

/** How a Zakat asset entry was created */
export type ZakatAssetInputSource =
  | 'USER_ENTRY'   // Direct user input via the Zakat form
  | 'IMPORT'       // Imported from an external data source
  | 'MIGRATION';   // Migrated from a legacy calculation

/** Irrigation method — only applicable to AGRICULTURAL_PRODUCE */
export type IrrigationMethod =
  | 'RAIN_FED'    // Naturally irrigated — 10% rate applies (Hanafi/Shafii/Hanbali)
  | 'IRRIGATION'; // Artificially irrigated — 5% rate applies

/** Optional breakdown item within an asset category (e.g. individual stock entries) */
export interface ZakatAssetBreakdownItem {
  /** User-entered description of this item */
  description: string;
  /** Market value or amount of this item */
  value: number;
  /** Optional quantity (for livestock, weight for produce) */
  quantity?: number;
  /** Optional notes */
  notes?: string;
}

/** A single Zakat asset entry for a specific calculation */
export interface ZakatAssetInstanceRecord {
  /** Unique identifier for this instance */
  instanceId: string;
  /** The calculation this entry belongs to */
  calculationId: string;
  /** Resolved canonical category ID */
  categoryId: CanonicalZakatCategoryId;
  /** The canonical category version used when this entry was recorded */
  categoryVersion: string;
  /** The amount or weight entered by the user */
  amount: number;
  /** Unit of the amount (currency code, 'grams', 'head', 'kg', etc.) */
  unit: string;
  /** Currency code (if amount is monetary) */
  currencyCode?: string;
  /** Original text or key entered by the user (before normalization) */
  rawInputText?: string;
  /** Normalization result for this entry */
  normalization?: ZakatCategoryNormalizationResult;
  /** Hawl record for this asset entry */
  hawlRecord?: HawlRecord;
  /** Irrigation method (AGRICULTURAL_PRODUCE only) */
  irrigationMethod?: IrrigationMethod;
  /** Breakdown items (when allowsItemBreakdown is true) */
  breakdownItems?: ZakatAssetBreakdownItem[];
  /** Input source */
  inputSource: ZakatAssetInputSource;
  /** Whether the user has manually confirmed this entry is accurate */
  userConfirmed: boolean;
  /** Whether this entry is a liability (deductible) */
  isLiability: boolean;
  /** Timestamp this entry was recorded */
  recordedAt: string;
}

// ─── Normalization Input ───────────────────────────────────────────────────────

/** Input for the Zakat asset normalization service */
export interface ZakatAssetNormalizationInput {
  /** Raw user input text (e.g. "business stock", "mal al tijarah") */
  rawInput: string;
  /** Current madhhab context */
  madhhab: string;
  /** Language tag for resolving language-specific aliases */
  languageTag: string;
  /** Knowledge release version for availability check */
  knowledgeReleaseVersion?: string;
}
