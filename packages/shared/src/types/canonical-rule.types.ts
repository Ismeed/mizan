/**
 * MIZAN — Canonical Rule Contract
 *
 * Every Mirath and Zakat rule MUST conform to this contract.
 * Rules must be scholar-approved before entering PRODUCTION status.
 *
 * CRITICAL CONSTRAINTS:
 *  - Conditions are purely declarative JSON — no executable code
 *  - All fractions use {numerator, denominator} — no floating-point
 *  - Every rule has a permanent immutable ID
 *  - Every rule links to verifiable source evidence
 *  - No rule may be marked PRODUCTION without full governance review
 */

import { AnyRuleTypeString } from './rule-types.registry';
import { Condition } from './rule-condition.types';
import { RuleDecision } from './rule-decision.types';
import type { RuleModule } from './rule-identifier.types';

export type { RuleModule };

export type RuleGovernanceStatus =
  | 'DRAFT'
  | 'ACADEMIC_REVIEW'
  | 'SHARIA_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED'
  | 'PRODUCTION'
  | 'DEPRECATED'
  | 'REJECTED'
  | 'SUPERSEDED';

export type RuleMadhhabScope =
  | 'HANAFI'
  | 'MALIKI'
  | 'SHAFII'
  | 'HANBALI'
  | 'JAFARI'
  | 'ALL_SUNNI'
  | 'ALL_SCHOOLS';

export type RuleConflictPolicy = 'SPECIFICITY_WINS' | 'PRIORITY_WINS' | 'STOP_AND_LOG';

// ─── Rule Identity ────────────────────────────────────────────────────────────

export interface RuleIdentity {
  /** Permanent immutable rule identifier — format: MODULE-TYPE-SUBJECT-CONTEXT-NNN */
  ruleId: string;
  /** Semantic version of this rule record, e.g. "1.0.0" */
  ruleVersion: string;
  /** ID of the rule family this rule belongs to, if any */
  ruleFamilyId?: string;
  /** If this is an override, the ID of the base rule it overrides */
  overridesRuleId?: string;
  /** Rules that must be applied before this rule */
  requiresPreviousRules?: string[];
  /** Rules that cannot coexist with this rule in the same release */
  incompatibleWithRules?: string[];
}

// ─── Rule Titles ─────────────────────────────────────────────────────────────

export interface RuleTitles {
  titleEn: string;
  titleAr?: string;
  titleFr?: string;
  descriptionEn: string;
  descriptionAr?: string;
}

// ─── Rule Scope ───────────────────────────────────────────────────────────────

export interface RuleScope {
  module: RuleModule;
  ruleType: AnyRuleTypeString;
  /** Which madhhabs this rule applies to */
  madhhabScope: RuleMadhhabScope[];
  /** Knowledge release version this rule targets, e.g. "1.0.0" */
  knowledgeReleaseVersion: string;
  /** Override precedence within a family — higher = applied later/overrides lower */
  priority?: number;
}

// ─── Rule Applicability ───────────────────────────────────────────────────────

export interface RuleApplicability {
  /** Declarative condition tree — must evaluate to true for this rule to apply */
  conditions: Condition;
  /** Optional human-readable summary of when this rule applies */
  conditionSummary?: string;
  /** How many conditions match (used for specificity resolution) */
  conditionCount?: number;
}

// ─── Rule Evidence ────────────────────────────────────────────────────────────

export interface RuleEvidenceRef {
  /** Knowledge record ID (type: SOURCE or EVIDENCE) that supports this rule */
  evidenceId: string;
  evidenceVersion: string;
  /** Short human-readable reference label, e.g. "Quran 4:11" */
  referenceLabel: string;
  evidenceType: 'QURAN' | 'HADITH' | 'FIQH_BOOK' | 'CONSENSUS' | 'SCHOLARLY_OPINION';
  /** Strength of this evidence for this specific rule */
  evidenceStrength: 'DEFINITIVE' | 'STRONG' | 'ACCEPTABLE' | 'WEAK';
  isMandatory: boolean;
}

export interface RuleExplanationRef {
  explanationId: string;
  explanationVersion: string;
  audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL';
  languageCode: string;
}

// ─── Rule Governance ─────────────────────────────────────────────────────────

export interface RuleGovernance {
  status: RuleGovernanceStatus;
  /** Whether this fixture is synthetic test-only data — cannot be PRODUCTION */
  isTestFixture: boolean;
  /**
   * Tag for test-only fixtures — must be set to 'TEST_ONLY_FIXTURE' for any
   * rule that has not passed full scholar governance review.
   */
  fixtureTag?: 'TEST_ONLY_FIXTURE';
  /** Semantic version gate — which schema version this rule was authored against */
  schemaVersion: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  /** Free-text notes for academic and sharia reviewers */
  reviewNotes?: string;
  /** Whether this rule requires a scholar to counter-sign every execution */
  requiresScholarCounterSignPerExecution?: boolean;
}

// ─── Rule Versioning ─────────────────────────────────────────────────────────

export interface RuleVersioning {
  /** SHA-256 checksum of the canonical content (ruleId + version + conditions + decisions + evidenceRefs) */
  contentChecksum: string;
  /** ID of the rule record this version supersedes */
  supersedes?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  changelogNote?: string;
}

// ─── Full Canonical Rule ──────────────────────────────────────────────────────

export interface CanonicalRule {
  identity:       RuleIdentity;
  titles:         RuleTitles;
  scope:          RuleScope;
  applicability:  RuleApplicability;
  /** Ordered list of decisions to execute when this rule matches */
  decisions:      RuleDecision[];
  evidenceRefs:   RuleEvidenceRef[];
  explanationRefs: RuleExplanationRef[];
  governance:     RuleGovernance;
  versioning:     RuleVersioning;
}

// ─── Rule Family ─────────────────────────────────────────────────────────────

export interface RuleFamily {
  ruleFamilyId: string;
  titleEn: string;
  module: RuleModule;
  ruleType: AnyRuleTypeString;
  /** The base rule ID — all overrides are variations of this */
  baseRuleId: string;
  overrideRuleIds: string[];
  conflictPolicy: RuleConflictPolicy;
  schemaVersion: string;
}

// ─── Execution Trace ─────────────────────────────────────────────────────────

export interface AppliedRule {
  ruleId: string;
  ruleVersion: string;
  ruleType: AnyRuleTypeString;
  titleEn: string;
  madhhabScope: RuleMadhhabScope[];
  evidenceRefs: RuleEvidenceRef[];
  decisionsApplied: RuleDecision['decisionType'][];
  conditionTrace?: unknown;
}

export interface RuleExecutionTrace {
  calculationId: string;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
  madhhab: string;
  appliedRules: AppliedRule[];
  conflictsDetected: boolean;
  conflictDetails?: string[];
  executedAt: string;
  totalRulesEvaluated: number;
  totalRulesMatched: number;
  totalRulesApplied: number;
}
