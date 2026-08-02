/**
 * MIZAN — Hijab Resolver Service (Phase 6)
 *
 * Orchestrates the full hijab resolution pipeline for a single calculation:
 *
 * 1. Load applicable HijabRule records for the madhhab (via Registry)
 * 2. Determine structural applicability given present heirs (via Applicability)
 * 3. Apply applicable rules to produce per-heir HijabStatus decisions
 * 4. Handle madhhab-specific variances (separate rule records per madhhab)
 * 5. Build the complete HijabResolutionOutput with full trace
 * 6. Write immutable audit record (via Audit service)
 *
 * CRITICAL: This service is deterministic and stateless.
 * All randomness is forbidden. The same inputs MUST produce the same output.
 */

import type {
  HijabResolutionInput,
  HijabResolutionOutput,
  HeirHijabStatus,
  HijabResolutionTrace,
  HijabRuleRecord,
} from '@mizan/shared';
import { HijabRuleRegistryService } from './hijab-rule-registry.service';
import { HijabApplicabilityService } from './hijab-applicability.service';
import { HijabAuditService } from './hijab-audit.service';

export class HijabResolverService {
  /**
   * Main entry point.
   * Resolves hijab blocking for all heirs in a single calculation.
   */
  static async resolve(
    input: HijabResolutionInput,
    allowTestFixtures = false
  ): Promise<HijabResolutionOutput> {
    const { madhhab, presentHeirs, heirAttributes = {}, calculationId, profileId } = input;

    // Step 1: Load all PRODUCTION hijab rules for this madhhab
    const allRules = await HijabRuleRegistryService.loadRulesForMadhhab(
      madhhab,
      allowTestFixtures
    );

    if (allRules.length === 0) {
      const output: HijabResolutionOutput = {
        status: 'NO_BLOCKING_RULES_APPLICABLE',
        heirStatuses: HijabResolverService.buildDefaultStatuses(presentHeirs, madhhab),
        resolutionTrace: [],
        madhhab,
        resolvedAt: new Date().toISOString(),
        warnings: ['No PRODUCTION hijab rules found for the selected madhhab'],
      };

      if (calculationId) {
        await HijabAuditService.writeAudit({
          calculationId,
          madhhab,
          profileId,
          presentHeirsJson: presentHeirs,
          rulesEvaluatedCount: 0,
          rulesAppliedCount: 0,
          heirStatusesJson: output.heirStatuses,
          resolutionTraceJson: [],
          hasPartialResolution: false,
        });
      }

      return output;
    }

    // Step 2: Determine structural applicability
    const applicabilityResults = HijabApplicabilityService.determineApplicableRules(
      allRules,
      presentHeirs,
      heirAttributes
    );

    // Step 3: Build resolution trace (all rules evaluated)
    const resolutionTrace: HijabResolutionTrace[] = applicabilityResults.map((result) => ({
      hijabRuleId: result.rule.hijabRuleId,
      hijabRuleVersion: result.rule.hijabRuleVersion,
      titleEn: result.rule.titleEn,
      blockedHeirKey: result.rule.blockedHeirKey,
      blockingCause: result.rule.blockingCause,
      effectType: result.rule.effectType,
      category: result.rule.category,
      madhhab,
      wasApplied: result.isApplicable,
      applicationReason: result.reason,
      evidenceRefs: result.rule.evidenceRefs,
    }));

    // Step 4: Apply applicable rules — build per-heir statuses
    const applicableRules = applicabilityResults
      .filter((r) => r.isApplicable)
      .map((r) => r.rule);

    const heirStatuses = HijabResolverService.buildHeirStatuses(
      presentHeirs,
      applicableRules,
      madhhab
    );

    // Step 5: Determine overall status
    const hasAnyPartial = heirStatuses.some((s) => s.isReduced && !s.isCompletelyExcluded);
    const hasAnyExcluded = heirStatuses.some((s) => s.isCompletelyExcluded);

    let status: HijabResolutionOutput['status'];
    if (applicableRules.length === 0) {
      status = 'NO_BLOCKING_RULES_APPLICABLE';
    } else if (hasAnyPartial && !hasAnyExcluded) {
      status = 'PARTIAL_RESOLUTION';
    } else {
      status = 'RESOLVED';
    }

    const output: HijabResolutionOutput = {
      status,
      heirStatuses,
      resolutionTrace,
      madhhab,
      resolvedAt: new Date().toISOString(),
    };

    // Step 6: Write immutable audit record
    if (calculationId) {
      await HijabAuditService.writeAudit({
        calculationId,
        madhhab,
        profileId,
        presentHeirsJson: presentHeirs,
        rulesEvaluatedCount: allRules.length,
        rulesAppliedCount: applicableRules.length,
        heirStatusesJson: heirStatuses,
        resolutionTraceJson: resolutionTrace,
        hasPartialResolution: hasAnyPartial,
      });
    }

    return output;
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  /**
   * Builds the per-heir status map by applying all applicable hijab rules.
   * Rules are applied in order of specificity: HIRMAN rules take precedence
   * over NUQSAN rules for the same heir. Multiple HIRMAN rules for the same
   * heir are allowed and the first one found is used (they produce the same result).
   */
  private static buildHeirStatuses(
    presentHeirs: Record<string, number>,
    applicableRules: HijabRuleRecord[],
    madhhab: HijabResolutionInput['madhhab']
  ): HeirHijabStatus[] {
    // Initialise all heirs as eligible
    const statusMap = new Map<string, HeirHijabStatus>();

    for (const [heirKey, count] of Object.entries(presentHeirs)) {
      if (count > 0) {
        statusMap.set(heirKey, {
          heirKey,
          isEligible: true,
          isCompletelyExcluded: false,
          isReduced: false,
          madhhab,
        });
      }
    }

    // Separate HIRMAN and NUQSAN rules — HIRMAN applied first
    const hirmanRules = applicableRules.filter((r) => r.effectType === 'HIRMAN');
    const nuqsanRules = applicableRules.filter((r) => r.effectType === 'NUQSAN');

    // Apply HIRMAN rules (complete exclusion)
    for (const rule of hirmanRules) {
      const existing = statusMap.get(rule.blockedHeirKey);
      if (!existing) continue;

      // Only apply if the heir hasn't already been completely excluded
      if (!existing.isCompletelyExcluded) {
        statusMap.set(rule.blockedHeirKey, {
          heirKey: rule.blockedHeirKey,
          isEligible: false,
          isCompletelyExcluded: true,
          isReduced: false,
          blockedBy: rule.blockingCause,
          appliedHijabRuleId: rule.hijabRuleId,
          appliedHijabRuleVersion: rule.hijabRuleVersion,
          madhhab,
          effectType: 'HIRMAN',
          evidenceRefs: rule.evidenceRefs,
        });
      }
    }

    // Apply NUQSAN rules (partial reduction) — only if not already excluded
    for (const rule of nuqsanRules) {
      const existing = statusMap.get(rule.blockedHeirKey);
      if (!existing) continue;

      // Do not apply NUQSAN if heir is already HIRMAN-excluded
      if (existing.isCompletelyExcluded) continue;

      statusMap.set(rule.blockedHeirKey, {
        heirKey: rule.blockedHeirKey,
        isEligible: true,
        isCompletelyExcluded: false,
        isReduced: true,
        blockedBy: rule.blockingCause,
        reducedFraction: rule.reducedFraction,
        appliedHijabRuleId: rule.hijabRuleId,
        appliedHijabRuleVersion: rule.hijabRuleVersion,
        madhhab,
        effectType: 'NUQSAN',
        evidenceRefs: rule.evidenceRefs,
      });
    }

    return Array.from(statusMap.values());
  }

  /**
   * Builds default eligible statuses for all present heirs
   * when no applicable rules exist.
   */
  private static buildDefaultStatuses(
    presentHeirs: Record<string, number>,
    madhhab: HijabResolutionInput['madhhab']
  ): HeirHijabStatus[] {
    return Object.entries(presentHeirs)
      .filter(([, count]) => count > 0)
      .map(([heirKey]) => ({
        heirKey,
        isEligible: true,
        isCompletelyExcluded: false,
        isReduced: false,
        madhhab,
      }));
  }
}
