/**
 * Translation Coverage & Audit Services
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export interface TranslationCoverageReport {
  languageTag: string;
  totalRequiredExplanations: number;
  approvedTranslations: number;
  missingTranslations: number;
  draftTranslations: number;
  coveragePercentage: number;
  productionBlockers: string[];
}

export class TranslationCoverageService {
  public static computeCoverage(
    languageTag: string,
    requiredExplanationIds: string[],
    approvedTranslationIds: string[],
    draftTranslationIds: string[]
  ): TranslationCoverageReport {
    const totalRequired = requiredExplanationIds.length;
    let approved = 0;
    let draft = 0;
    const blockers: string[] = [];

    for (const id of requiredExplanationIds) {
      if (approvedTranslationIds.includes(id)) {
        approved++;
      } else if (draftTranslationIds.includes(id)) {
        draft++;
        blockers.push(`DRAFT_TRANSLATION:${id}`);
      } else {
        blockers.push(`MISSING_TRANSLATION:${id}`);
      }
    }

    const missing = totalRequired - approved - draft;
    const pct = totalRequired > 0 ? (approved / totalRequired) * 100 : 100;

    return {
      languageTag,
      totalRequiredExplanations: totalRequired,
      approvedTranslations: approved,
      missingTranslations: missing,
      draftTranslations: draft,
      coveragePercentage: Math.round(pct * 100) / 100,
      productionBlockers: blockers,
    };
  }
}

export class ExplanationAuditService {
  private static auditLogs: any[] = [];

  public static logEvent(eventType: string, explanationId: string, languageTag: string, details: any): void {
    this.auditLogs.push({
      eventId: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      eventType,
      explanationId,
      languageTag,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  public static getLogs(explanationId?: string): any[] {
    if (!explanationId) return this.auditLogs;
    return this.auditLogs.filter((l) => l.explanationId === explanationId);
  }

  public static clear(): void {
    this.auditLogs = [];
  }
}
