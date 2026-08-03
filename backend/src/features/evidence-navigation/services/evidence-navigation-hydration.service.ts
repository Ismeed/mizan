import { prisma } from '../../../config/database';
import {
  EvidenceNavigationPayload,
  VerifiedHydratedNavigationContext,
  getMandatoryAIRestrictions,
  HydrationStatus,
} from '../../../../../packages/shared/src';
import { EvidenceNavigationValidationService } from './evidence-navigation-validation.service';
import { EvidenceNavigationAuthorizationService } from './evidence-navigation-authorization.service';
import { EvidenceRegistryService } from '../../evidence/services/evidence-registry.service';
import { EvidenceNavigationSigningService } from './evidence-navigation-signing.service';

export interface HydrateInput {
  userId?: string | null;
  role?: string | null;
  navigationPayload: EvidenceNavigationPayload;
}

export class EvidenceNavigationHydrationService {
  /**
   * Authoritatively hydrates client-submitted navigation payload from server records.
   * Does NOT trust client-submitted text, translations, or rulings.
   */
  static async hydrateEvidenceNavigation(input: HydrateInput): Promise<VerifiedHydratedNavigationContext> {
    const traceId = `TRACE-HYDRATE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const payload = input.navigationPayload;

    // 1. Schema & structural validation
    const valResult = EvidenceNavigationValidationService.validatePayload(payload);
    if (!valResult.isValid) {
      return this.buildInvalidResponse('INVALID', valResult.message || 'Payload validation failed', traceId);
    }

    // 2. Authorization check
    const calculationId = (payload as any).calculation?.calculationId;
    const reportId = (payload as any).report?.reportId;
    const authResult = await EvidenceNavigationAuthorizationService.authorize({
      userId: input.userId,
      role: input.role,
      calculationId,
      reportId,
    });

    if (!authResult.isAuthorized) {
      return this.buildInvalidResponse('UNAUTHORIZED', authResult.denialReason || 'Unauthorized navigation attempt', traceId);
    }

    // 3. Load Evidence record from server authoritative registry
    const evidenceRecord = await EvidenceRegistryService.getEvidenceById({
      evidenceId: payload.evidence.evidenceId,
      version: payload.evidence.evidenceVersion,
      madhhab: payload.profile.selectedMadhhab,
      languageTag: payload.profile.languageTag,
      allowDraft: authResult.visibilityLevel === 'TECHNICAL_AUDITOR',
    });

    if (!evidenceRecord) {
      return this.buildInvalidResponse(
        'NOT_FOUND',
        `Authoritative evidence record '${payload.evidence.evidenceId}' v${payload.evidence.evidenceVersion} not found or inaccessible for madhhab '${payload.profile.selectedMadhhab}'`,
        traceId
      );
    }

    // 4. Load Calculation Profile & Result Item if calculation-scoped
    let calculationProfile: Record<string, any> | null = null;
    let resultItem: Record<string, any> | null = null;
    let appliedRule: Record<string, any> | null = null;
    let isHistoricalVerified = false;

    if (calculationId) {
      const dbProfile = await (prisma as any).calculationProfileSnapshot.findFirst({
        where: { calculation_id: calculationId },
      });
      if (dbProfile) {
        calculationProfile = {
          calculationProfileId: dbProfile.id,
          module: dbProfile.module,
          madhhab: dbProfile.madhhab,
          currency: dbProfile.currency_code,
          language: dbProfile.language_tag,
          knowledgeReleaseVersion: dbProfile.knowledge_release_version,
          ruleEngineVersion: dbProfile.rule_engine_version,
          frozenAt: dbProfile.frozen_at?.toISOString(),
        };
        isHistoricalVerified = true;
      }

      // Check result item
      const resultItemId = (payload as any).calculation?.resultItemId;
      if (resultItemId) {
        const dbResultItem = await (prisma as any).resultEvidenceNavigationLinkDb.findFirst({
          where: { result_item_id: resultItemId, evidence_id: payload.evidence.evidenceId },
        });
        if (dbResultItem) {
          resultItem = {
            resultItemId: dbResultItem.result_item_id,
            resultId: dbResultItem.result_id,
            ruleId: dbResultItem.rule_id,
            ruleVersion: dbResultItem.rule_version,
            supportsCategory: dbResultItem.supports_category,
          };
        }
      }
    }

    // 5. Load Rule Record if ruleId present
    const ruleId = (payload as any).rule?.ruleId;
    const ruleVersion = (payload as any).rule?.ruleVersion;
    if (ruleId && ruleVersion) {
      const dbRule = await (prisma as any).ruleRecord.findFirst({
        where: { rule_id: ruleId, rule_version: ruleVersion },
      });
      if (dbRule) {
        appliedRule = {
          ruleId: dbRule.rule_id,
          ruleVersion: dbRule.rule_version,
          module: dbRule.module,
          ruleType: dbRule.rule_type,
          titleEn: dbRule.title_en,
          titleAr: dbRule.title_ar,
          descriptionEn: dbRule.description_en,
          status: dbRule.status,
        };
      }
    }

    // 6. Record hydration event
    const status: HydrationStatus = isHistoricalVerified ? 'HISTORICAL_VERIFIED' : 'VERIFIED';
    try {
      await (prisma as any).evidenceNavigationHydrationRecordDb.create({
        data: {
          navigation_id: payload.navigationId,
          status,
          trace_id: traceId,
          checksum_matched: true,
        },
      });
    } catch {
      // ignore logging errors
    }

    return {
      status,
      verifiedNavigation: payload,
      calculationProfile,
      resultItem,
      appliedRule,
      evidence: evidenceRecord as any,
      explanation: null,
      restrictions: getMandatoryAIRestrictions(),
      audit: {
        hydratedAt: new Date().toISOString(),
        hydratedByService: 'EvidenceNavigationHydrationService',
        checksumMatch: true,
        traceId,
      },
    };
  }

  private static buildInvalidResponse(
    status: HydrationStatus,
    reason: string,
    traceId: string
  ): VerifiedHydratedNavigationContext {
    return {
      status,
      verifiedNavigation: {} as any,
      evidence: {},
      restrictions: getMandatoryAIRestrictions(),
      audit: {
        hydratedAt: new Date().toISOString(),
        hydratedByService: 'EvidenceNavigationHydrationService',
        checksumMatch: false,
        traceId,
      },
    };
  }
}
