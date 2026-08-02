/**
 * MIZAN — Zakat Nisab Types (Phase 8)
 *
 * Machine-readable types for nisab threshold resolution,
 * commodity pricing, and hawl tracking.
 *
 * CRITICAL: Nisab VALUES are determined by the Rule Engine and
 * market price feeds — not by this type definition.
 * This file defines only the structural contracts.
 */

import type { CanonicalZakatCategoryId, ZakatNisabBase } from './canonical-zakat-category.types';

// ─── Nisab Commodity Prices ───────────────────────────────────────────────────

/** Source of commodity price data */
export type NisabPriceSource =
  | 'MARKET_FEED'       // Live or near-live commodity market price
  | 'CACHED_DAILY'      // Daily-refreshed cached price
  | 'MANUAL_OVERRIDE'   // Manually entered by admin
  | 'FALLBACK_STATIC';  // Emergency static fallback value

export interface NisabCommodityPrice {
  /** The commodity: GOLD or SILVER */
  commodity: 'GOLD' | 'SILVER';
  /** Price per gram in the given currency */
  pricePerGram: number;
  /** ISO 4217 currency code */
  currencyCode: string;
  /** When this price was recorded */
  recordedAt: string;
  /** Data source for this price */
  source: NisabPriceSource;
  /** Whether this is a fallback and should be flagged in the UI */
  isFallback: boolean;
}

// ─── Nisab Threshold Resolution ───────────────────────────────────────────────

/** Resolved nisab threshold for a specific category in a specific madhhab */
export interface ResolvedNisabThreshold {
  /** The category this threshold applies to */
  categoryId: CanonicalZakatCategoryId;
  /** The nisab base used */
  nisabBase: ZakatNisabBase;
  /** The resolved threshold value */
  thresholdValue: number;
  /** Unit of the threshold (e.g. "NGN", "USD", "kg", "head") */
  thresholdUnit: string;
  /** The madhhab this resolution was computed for */
  madhhab: string;
  /** Commodity prices used in computation (if monetary nisab) */
  goldPrice?: NisabCommodityPrice;
  silverPrice?: NisabCommodityPrice;
  /** Whether the lower nisab (silver) was applied */
  usedLowerNisab?: boolean;
  /** Timestamp of this resolution */
  resolvedAt: string;
}

// ─── Hawl (Lunar Year) Tracking ───────────────────────────────────────────────

/** Status of the hawl condition for a category */
export type HawlStatus =
  | 'MET'              // One full lunar year has elapsed
  | 'NOT_MET'          // Hawl has not yet completed
  | 'NOT_REQUIRED'     // This category does not require hawl
  | 'UNKNOWN';         // User has not provided hawl date

export interface HawlRecord {
  categoryId: CanonicalZakatCategoryId;
  hawlStatus: HawlStatus;
  /** Date the asset was first acquired or exceeded nisab */
  hawlStartDate?: string;
  /** Projected hawl completion date (lunar calendar) */
  hawlDueDate?: string;
  /** Date the user confirmed hawl was met */
  userConfirmedAt?: string;
}

// ─── Nisab Decision Record ────────────────────────────────────────────────────

/** Whether nisab was met for a given category in a calculation */
export interface ZakatNisabDecision {
  categoryId: CanonicalZakatCategoryId;
  threshold: ResolvedNisabThreshold;
  hawlRecord: HawlRecord;
  categoryAmount: number;
  nisabMet: boolean;
  hawlMet: boolean;
  obligationTriggered: boolean;
}
