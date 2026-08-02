/**
 * MIZAN — Hijab Explanation Service (Phase 6)
 *
 * Generates multilingual, audience-aware explanations for Hijab decisions.
 *
 * CRITICAL: This service NEVER generates Islamic rulings from AI.
 * All explanations are sourced from pre-approved HijabExplanationRef records
 * stored in the EvidenceRecord table or as inline multilingual strings
 * registered by scholars.
 *
 * The service provides:
 * 1. Look up approved explanations by explanationId + languageCode
 * 2. Fall back to English if the requested language is unavailable
 * 3. Generate a structured explanation payload for UI/PDF/AI-assistant
 */

import { prisma } from '../../../config/database';
import type { HeirHijabStatus, HijabRuleRecord, HijabExplanationRef } from '@mizan/shared';

export interface HijabExplanationPayload {
  heirKey: string;
  effectType: 'HIRMAN' | 'NUQSAN' | 'ELIGIBLE';
  languageCode: string;
  headlineText: string;
  bodyText: string;
  evidenceLabel?: string;
  audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL';
  isApproved: boolean;
  fallbackApplied: boolean;
}

export class HijabExplanationService {
  /**
   * Generates explanation payloads for all heir statuses in the resolution output.
   *
   * @param heirStatuses   Resolved heir statuses from HijabResolverService
   * @param rules          The full list of hijab rules (for reference lookup)
   * @param languageCode   Requested language (e.g. 'en', 'ar', 'fr')
   * @param audienceType   Target audience for the explanation
   */
  static async buildExplanations(
    heirStatuses: HeirHijabStatus[],
    rules: HijabRuleRecord[],
    languageCode: string = 'en',
    audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL' = 'GENERAL_USER'
  ): Promise<HijabExplanationPayload[]> {
    const payloads: HijabExplanationPayload[] = [];

    for (const status of heirStatuses) {
      const payload = await HijabExplanationService.buildForHeir(
        status,
        rules,
        languageCode,
        audienceType
      );
      payloads.push(payload);
    }

    return payloads;
  }

  /**
   * Builds an explanation for a single heir's hijab status.
   */
  static async buildForHeir(
    status: HeirHijabStatus,
    rules: HijabRuleRecord[],
    languageCode: string,
    audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL'
  ): Promise<HijabExplanationPayload> {
    if (!status.appliedHijabRuleId) {
      // Heir is eligible — no blocking applied
      return {
        heirKey: status.heirKey,
        effectType: 'ELIGIBLE',
        languageCode,
        headlineText: HijabExplanationService.getEligibleHeadline(status.heirKey, languageCode),
        bodyText: HijabExplanationService.getEligibleBody(status.heirKey, languageCode),
        audienceType,
        isApproved: true,
        fallbackApplied: false,
      };
    }

    // Find the applied rule
    const appliedRule = rules.find((r) => r.hijabRuleId === status.appliedHijabRuleId);
    if (!appliedRule) {
      return HijabExplanationService.buildFallbackPayload(status, languageCode, audienceType);
    }

    // Look for an approved explanation reference
    const explanationRef = HijabExplanationService.findBestExplanationRef(
      appliedRule.explanationRefs,
      languageCode,
      audienceType
    );

    if (explanationRef) {
      const approved = await HijabExplanationService.fetchApprovedExplanation(explanationRef);
      if (approved) {
        return {
          heirKey: status.heirKey,
          effectType: status.effectType ?? (status.isCompletelyExcluded ? 'HIRMAN' : 'NUQSAN'),
          languageCode,
          headlineText: approved.headlineText,
          bodyText: approved.bodyText,
          evidenceLabel: appliedRule.evidenceRefs[0]?.referenceLabel,
          audienceType,
          isApproved: true,
          fallbackApplied: false,
        };
      }
    }

    // Generate a structural fallback explanation from rule metadata
    return HijabExplanationService.buildStructuralExplanation(status, appliedRule, languageCode, audienceType);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private static findBestExplanationRef(
    refs: HijabExplanationRef[],
    languageCode: string,
    audienceType: string
  ): HijabExplanationRef | null {
    // First: exact match on language + audience
    let match = refs.find(
      (r) => r.languageCode === languageCode && r.audienceType === audienceType
    );
    if (match) return match;

    // Second: exact language, any audience
    match = refs.find((r) => r.languageCode === languageCode);
    if (match) return match;

    // Third: English fallback
    match = refs.find((r) => r.languageCode === 'en');
    return match ?? null;
  }

  private static async fetchApprovedExplanation(
    ref: HijabExplanationRef
  ): Promise<{ headlineText: string; bodyText: string } | null> {
    try {
      const record = await (prisma as any).evidenceTranslation.findFirst({
        where: {
          evidence_id: ref.explanationId,
          evidence_version: ref.explanationVersion,
          language_tag: ref.languageCode,
          review_status: 'APPROVED',
        },
      });
      if (!record) return null;
      // The text field contains a JSON payload: { headline, body }
      try {
        const parsed = JSON.parse(record.text);
        return {
          headlineText: parsed.headline ?? record.text,
          bodyText: parsed.body ?? record.text,
        };
      } catch {
        return { headlineText: record.text, bodyText: record.text };
      }
    } catch {
      return null;
    }
  }

  private static buildStructuralExplanation(
    status: HeirHijabStatus,
    rule: HijabRuleRecord,
    languageCode: string,
    audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL'
  ): HijabExplanationPayload {
    const effectLabel = rule.effectType === 'HIRMAN' ? 'completely excluded' : 'reduced in share';
    const headlineText = `${status.heirKey} is ${effectLabel}`;
    const bodyText =
      rule.effectType === 'HIRMAN'
        ? `${status.heirKey} does not inherit because ${rule.blockingCause} is present. This is a complete exclusion (Hijab Hirman) under ${rule.titleEn}.`
        : `The share of ${status.heirKey} is reduced because ${rule.blockingCause} is present. This is a partial reduction (Hijab Nuqsan) under ${rule.titleEn}.`;

    return {
      heirKey: status.heirKey,
      effectType: rule.effectType,
      languageCode: 'en', // Structural fallback is always English
      headlineText,
      bodyText,
      evidenceLabel: rule.evidenceRefs[0]?.referenceLabel,
      audienceType,
      isApproved: false,
      fallbackApplied: true,
    };
  }

  private static buildFallbackPayload(
    status: HeirHijabStatus,
    languageCode: string,
    audienceType: 'GENERAL_USER' | 'SCHOLAR' | 'TECHNICAL'
  ): HijabExplanationPayload {
    return {
      heirKey: status.heirKey,
      effectType: status.isCompletelyExcluded ? 'HIRMAN' : status.isReduced ? 'NUQSAN' : 'ELIGIBLE',
      languageCode,
      headlineText: `${status.heirKey}: blocking rule applied`,
      bodyText: `A hijab rule was applied to ${status.heirKey}. Please consult the full calculation report for details.`,
      audienceType,
      isApproved: false,
      fallbackApplied: true,
    };
  }

  private static getEligibleHeadline(heirKey: string, languageCode: string): string {
    if (languageCode === 'ar') return `${heirKey}: وارث مستحق`;
    return `${heirKey} is eligible to inherit`;
  }

  private static getEligibleBody(heirKey: string, languageCode: string): string {
    if (languageCode === 'ar') {
      return `لم يُطبَّق أي حجب على ${heirKey} في هذه الحسابة. يرث هذا الوارث وفق نصيبه الشرعي.`;
    }
    return `No hijab blocking was applied to ${heirKey} in this calculation. This heir inherits according to their prescribed share.`;
  }
}
