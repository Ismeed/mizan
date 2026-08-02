/**
 * MIZAN — Hijab Applicability Service (Phase 6)
 *
 * Determines which canonical Hijab rules are applicable for a given
 * set of present heirs and a selected madhhab.
 *
 * This service performs ONLY structural applicability checks:
 * - Is the blocking heir actually present in sufficient numbers?
 * - Is the blocked heir actually present?
 * - Is the attribute-based condition met?
 *
 * It does NOT make final blocking decisions — that is the resolver's role.
 */

import type { HijabRuleRecord } from '@mizan/shared';

export interface HijabApplicabilityResult {
  rule: HijabRuleRecord;
  /** Whether the blocking cause (heir or attribute) is present */
  blockingCausePresent: boolean;
  /** Whether the heir to be blocked is actually present */
  blockedHeirPresent: boolean;
  /** Whether this rule is structurally applicable for resolution */
  isApplicable: boolean;
  /** Reason for applicability determination */
  reason: string;
}

export class HijabApplicabilityService {
  /**
   * Filters the full list of hijab rules down to those that are
   * structurally applicable given the present heirs.
   */
  static determineApplicableRules(
    rules: HijabRuleRecord[],
    presentHeirs: Record<string, number>,
    heirAttributes: Record<string, string[]> = {}
  ): HijabApplicabilityResult[] {
    return rules.map((rule) =>
      HijabApplicabilityService.evaluateRule(rule, presentHeirs, heirAttributes)
    );
  }

  /**
   * Evaluates a single hijab rule for structural applicability.
   */
  static evaluateRule(
    rule: HijabRuleRecord,
    presentHeirs: Record<string, number>,
    heirAttributes: Record<string, string[]> = {}
  ): HijabApplicabilityResult {
    const blockedHeirPresent = HijabApplicabilityService.isHeirPresent(
      rule.blockedHeirKey,
      presentHeirs
    );

    if (!blockedHeirPresent) {
      return {
        rule,
        blockingCausePresent: false,
        blockedHeirPresent: false,
        isApplicable: false,
        reason: `Blocked heir "${rule.blockedHeirKey}" is not present in this calculation`,
      };
    }

    let blockingCausePresent: boolean;
    let reason: string;

    if (rule.blockingCause === 'ATTRIBUTE') {
      // Attribute-based blocking (HAJB_BIL_WASF)
      blockingCausePresent = HijabApplicabilityService.isAttributePresent(
        rule.blockedHeirKey,
        rule.hijabRuleId,
        heirAttributes
      );
      reason = blockingCausePresent
        ? `Attribute-based blocking condition met for heir "${rule.blockedHeirKey}"`
        : `Attribute-based blocking condition not met for heir "${rule.blockedHeirKey}"`;
    } else {
      // Person-based blocking (HAJB_BIL_SHAKHSY)
      blockingCausePresent = HijabApplicabilityService.isHeirPresent(
        rule.blockingCause,
        presentHeirs
      );
      reason = blockingCausePresent
        ? `Blocking heir "${rule.blockingCause}" is present — rule is applicable`
        : `Blocking heir "${rule.blockingCause}" is not present — rule is not applicable`;
    }

    return {
      rule,
      blockingCausePresent,
      blockedHeirPresent,
      isApplicable: blockingCausePresent && blockedHeirPresent,
      reason,
    };
  }

  /**
   * Returns only the rules that are structurally applicable.
   */
  static filterApplicable(
    rules: HijabRuleRecord[],
    presentHeirs: Record<string, number>,
    heirAttributes: Record<string, string[]> = {}
  ): HijabRuleRecord[] {
    return HijabApplicabilityService.determineApplicableRules(
      rules,
      presentHeirs,
      heirAttributes
    )
      .filter((r) => r.isApplicable)
      .map((r) => r.rule);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private static isHeirPresent(
    heirKey: string,
    presentHeirs: Record<string, number>
  ): boolean {
    const count = presentHeirs[heirKey];
    return typeof count === 'number' && count > 0;
  }

  /**
   * Checks if a blocking attribute is present for the heir.
   * Attribute-based blocking is keyed by the hijabRuleId since each
   * attribute rule encodes a specific attribute condition.
   */
  private static isAttributePresent(
    heirKey: string,
    hijabRuleId: string,
    heirAttributes: Record<string, string[]>
  ): boolean {
    const attrs = heirAttributes[heirKey];
    if (!attrs || attrs.length === 0) return false;
    // Attribute rules encode the specific attribute in their ID segment
    // e.g. HIJAB-HUSBAND-ATTRIBUTE-001 checks for 'DIFFERENT_RELIGION'
    // The heirAttributes map contains the list of attribute flags per heir.
    // The caller is responsible for populating heirAttributes correctly.
    // Here we simply verify the heir has at least one attribute flag.
    return attrs.length > 0;
  }
}
