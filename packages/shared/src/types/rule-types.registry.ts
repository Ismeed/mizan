/**
 * MIZAN — Canonical Rule Type Registry
 *
 * Enumerates every permitted rule type for the MIRATH and ZAKAT modules.
 * Each type controls how the RuleExecutor interprets the rule's decision.
 */

// ─── Mirath Rule Types ────────────────────────────────────────────────────────

export enum MirathRuleType {
  /** Determines whether an heir is eligible to inherit at all */
  ELIGIBILITY            = 'MIRATH_ELIGIBILITY',
  /** Assigns a Quranic fixed fractional share (Fard) to an heir group */
  FIXED_SHARE            = 'MIRATH_FIXED_SHARE',
  /** Assigns residuary (Asabah) status to an heir group */
  RESIDUARY              = 'MIRATH_RESIDUARY',
  /** Applies blocking (Hijab): complete or partial exclusion of an heir */
  HIJAB                  = 'MIRATH_HIJAB',
  /** Applies an impediment to inheritance (e.g. different religion, murder) */
  IMPEDIMENT             = 'MIRATH_IMPEDIMENT',
  /** Sets the sequence for estate charges (debts, funeral, wasiyyah) */
  ESTATE_SEQUENCE        = 'MIRATH_ESTATE_SEQUENCE',
  /** Adjusts a share based on a special case (e.g. Awl, Radd, Umariyyatan) */
  ADJUSTMENT             = 'MIRATH_ADJUSTMENT',
  /** Controls how a share is distributed among multiple heirs in a group */
  DISTRIBUTION           = 'MIRATH_DISTRIBUTION',
  /** Requires mandatory scholar review before finalising a result */
  REVIEW_GATE            = 'MIRATH_REVIEW_GATE',
}

// ─── Zakat Rule Types ─────────────────────────────────────────────────────────

export enum ZakatRuleType {
  /** Determines whether a person is obligated to pay Zakat */
  ELIGIBILITY            = 'ZAKAT_ELIGIBILITY',
  /** Sets the Nisab threshold method and reference commodity */
  NISAB                  = 'ZAKAT_NISAB',
  /** Sets the Zakat rate as an exact rational number */
  RATE                   = 'ZAKAT_RATE',
  /** Sets the holding period (Hawl) requirement in lunar months */
  HOLDING_PERIOD         = 'ZAKAT_HOLDING_PERIOD',
  /** Aggregates multiple asset categories for a combined Nisab check */
  AGGREGATION            = 'ZAKAT_AGGREGATION',
  /** Allows a deduction (e.g. debts) from Zakatable wealth */
  DEDUCTION              = 'ZAKAT_DEDUCTION',
  /** Classifies an asset category as Zakatable or exempt */
  ASSET_CLASSIFICATION   = 'ZAKAT_ASSET_CLASSIFICATION',
  /** Agricultural Zakat — Ushr/Nisf Ushr rules */
  AGRICULTURE            = 'ZAKAT_AGRICULTURE',
  /** Livestock Zakat schedule (Nisab counts, per-head rates) */
  LIVESTOCK_SCHEDULE     = 'ZAKAT_LIVESTOCK_SCHEDULE',
  /** Business inventory Zakat rules */
  BUSINESS               = 'ZAKAT_BUSINESS',
  /** Investment and stock portfolio Zakat rules */
  INVESTMENT             = 'ZAKAT_INVESTMENT',
  /** Requires mandatory scholar review before finalising a result */
  REVIEW_GATE            = 'ZAKAT_REVIEW_GATE',
}

// ─── Combined rule type strings ───────────────────────────────────────────────

export type MirathRuleTypeString = `${MirathRuleType}`;
export type ZakatRuleTypeString  = `${ZakatRuleType}`;
export type AnyRuleTypeString    = MirathRuleTypeString | ZakatRuleTypeString;

export const ALL_MIRATH_RULE_TYPES: MirathRuleTypeString[] = Object.values(MirathRuleType) as MirathRuleTypeString[];
export const ALL_ZAKAT_RULE_TYPES:  ZakatRuleTypeString[]  = Object.values(ZakatRuleType)  as ZakatRuleTypeString[];
export const ALL_RULE_TYPES:        AnyRuleTypeString[]    = [...ALL_MIRATH_RULE_TYPES, ...ALL_ZAKAT_RULE_TYPES];
