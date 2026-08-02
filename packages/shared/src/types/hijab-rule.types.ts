/**
 * MIZAN — Hijab Rule Types & Contracts (Phase 6)
 *
 * Defines the complete type system for the Inheritance Blocking (Hijab)
 * and exclusion rule subsystem.
 *
 * CRITICAL CONSTRAINTS:
 *  - No hijab rule may be marked PRODUCTION without full scholar governance review
 *  - All blocking effects must reference a canonical HijabRule record
 *  - Madhhab-specific variances are represented as separate HijabRule records
 *  - Every HijabResolutionTrace must be immutably logged per calculation
 *  - The system NEVER invents Islamic rulings — all rules require evidence references
 */

import type { MadhhabCode } from './profile.types';
import type { RuleGovernanceStatus, RuleMadhhabScope } from './canonical-rule.types';

// ─── Hijab Effect Types ────────────────────────────────────────────────────────

/**
 * The type of blocking (Hijab) effect applied to an heir.
 *
 * HIRMAN = complete exclusion (heir receives nothing)
 * NUQSAN = partial reduction (heir's share is reduced, not eliminated)
 */
export type HijabEffectType = 'HIRMAN' | 'NUQSAN';

/**
 * The jurisprudential category of this blocking rule.
 *
 * HAJB_BIL_WASF    = blocking by attribute/impediment (e.g. different religion, murder)
 * HAJB_BIL_SHAKHSY = blocking by the presence of a specific person (e.g. son blocks brother)
 */
export type HijabCategoryType = 'HAJB_BIL_WASF' | 'HAJB_BIL_SHAKHSY';

// ─── Hijab Rule Record ────────────────────────────────────────────────────────

/**
 * A canonical, versioned, scholar-reviewed Hijab rule record.
 *
 * This is NOT a CanonicalRule — it is a dedicated rule record type for
 * inheritance blocking decisions with richer heir-specific semantics.
 */
export interface HijabRuleRecord {
  /** Permanent immutable ID — format: HIJAB-<BLOCKED_HEIR>-<BLOCKING_CAUSE>-NNN */
  hijabRuleId: string;
  /** Semantic version of this hijab rule record */
  hijabRuleVersion: string;
  /** Human-readable title in English */
  titleEn: string;
  /** Human-readable title in Arabic */
  titleAr?: string;
  /** Human-readable description in English */
  descriptionEn: string;
  /** Jurisprudential category of the blocking */
  category: HijabCategoryType;
  /** The heir being blocked or reduced */
  blockedHeirKey: string;
  /**
   * The heir or condition causing the blocking.
   * Use 'ATTRIBUTE' for attribute-based blocking (e.g. murder, different religion).
   */
  blockingCause: string | 'ATTRIBUTE';
  /** Type of Hijab effect applied */
  effectType: HijabEffectType;
  /**
   * For NUQSAN: the reduced fraction the blocked heir receives.
   * Must be null for HIRMAN.
   */
  reducedFraction?: { numerator: number; denominator: number };
  /** Which madhhabs apply this rule — use 'ALL_SCHOOLS' if universal */
  madhhabScope: RuleMadhhabScope[];
  /** Evidence references supporting this blocking rule */
  evidenceRefs: HijabEvidenceRef[];
  /** Multilingual explanation references */
  explanationRefs: HijabExplanationRef[];
  /** Governance record */
  governance: HijabRuleGovernance;
  /** Versioning metadata */
  versioning: HijabRuleVersioning;
}

// ─── Evidence Reference ────────────────────────────────────────────────────────

export interface HijabEvidenceRef {
  evidenceId: string;
  evidenceVersion: string;
  referenceLabel: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_BOOK' | 'CONSENSUS' | 'SCHOLARLY_OPINION';
  evidenceStrength: 'DEFINITIVE' | 'STRONG' | 'ACCEPTABLE' | 'WEAK';
  isMandatory: boolean;
}

// ─── Explanation Reference ─────────────────────────────────────────────────────

export interface HijabExplanationRef {
  explanationId: string;
  explanationVersion: string;
  audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL';
  languageCode: string;
}

// ─── Governance ────────────────────────────────────────────────────────────────

export interface HijabRuleGovernance {
  status: RuleGovernanceStatus;
  isTestFixture: boolean;
  fixtureTag?: 'TEST_ONLY_FIXTURE';
  schemaVersion: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  reviewNotes?: string;
  requiresScholarCounterSignPerExecution?: boolean;
}

// ─── Versioning ────────────────────────────────────────────────────────────────

export interface HijabRuleVersioning {
  contentChecksum: string;
  supersedes?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  changelogNote?: string;
}

// ─── Resolution Input ─────────────────────────────────────────────────────────

/**
 * Input to the HijabResolver for a single calculation.
 */
export interface HijabResolutionInput {
  /** The active madhhab from the frozen Calculation Profile */
  madhhab: MadhhabCode;
  /** All heirs present in this calculation and their counts */
  presentHeirs: Record<string, number>;
  /** Any heir-level attributes that trigger attribute-based blocking */
  heirAttributes?: Record<string, string[]>;
  /** Calculation ID for audit logging */
  calculationId?: string;
  /** Profile ID for audit correlation */
  profileId?: string;
}

// ─── Per-Heir Hijab Result ────────────────────────────────────────────────────

/**
 * The resolved Hijab status for a single heir group.
 */
export interface HeirHijabStatus {
  /** Heir key (matches HeirsInput keys) */
  heirKey: string;
  /** Whether this heir is eligible (not blocked) */
  isEligible: boolean;
  /** Whether this heir is completely excluded (hirman) */
  isCompletelyExcluded: boolean;
  /** Whether this heir's share is reduced (nuqsan) */
  isReduced: boolean;
  /** The blocking cause — another heir key or attribute name */
  blockedBy?: string;
  /** The reduced fraction for NUQSAN, if applicable */
  reducedFraction?: { numerator: number; denominator: number };
  /** The applied HijabRule record ID */
  appliedHijabRuleId?: string;
  /** Version of the applied rule */
  appliedHijabRuleVersion?: string;
  /** The madhhab under which the decision was made */
  madhhab: MadhhabCode;
  /** The hijab effect type applied */
  effectType?: HijabEffectType;
  /** Human-readable explanation in the user's language */
  explanation?: string;
  /** Evidence references for this decision */
  evidenceRefs?: HijabEvidenceRef[];
}

// ─── Resolution Trace ─────────────────────────────────────────────────────────

/**
 * Immutable trace record for each hijab rule evaluation in a calculation.
 */
export interface HijabResolutionTrace {
  hijabRuleId: string;
  hijabRuleVersion: string;
  titleEn: string;
  blockedHeirKey: string;
  blockingCause: string;
  effectType: HijabEffectType;
  category: HijabCategoryType;
  madhhab: MadhhabCode;
  wasApplied: boolean;
  /** Why this rule was or was not applied */
  applicationReason: string;
  evidenceRefs: HijabEvidenceRef[];
}

// ─── Resolution Output ────────────────────────────────────────────────────────

/**
 * Full output of the HijabResolver for one calculation.
 */
export interface HijabResolutionOutput {
  status:
    | 'RESOLVED'
    | 'NO_BLOCKING_RULES_APPLICABLE'
    | 'PARTIAL_RESOLUTION'
    | 'SCHEMA_VALIDATION_FAILED';
  /** Per-heir resolved statuses */
  heirStatuses: HeirHijabStatus[];
  /** Complete trace of all rules evaluated */
  resolutionTrace: HijabResolutionTrace[];
  /** Madhhab used for resolution */
  madhhab: MadhhabCode;
  /** ISO timestamp */
  resolvedAt: string;
  /** Any warnings or notes from the resolver */
  warnings?: string[];
}

// ─── Audit Record Input ────────────────────────────────────────────────────────

export interface HijabResolutionAuditInput {
  calculationId: string;
  madhhab: MadhhabCode;
  profileId?: string;
  presentHeirsJson: Record<string, number>;
  rulesEvaluatedCount: number;
  rulesAppliedCount: number;
  heirStatusesJson: HeirHijabStatus[];
  resolutionTraceJson: HijabResolutionTrace[];
  hasPartialResolution: boolean;
}
