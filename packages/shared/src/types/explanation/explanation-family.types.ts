/**
 * Explanation Family Types (Madhhab Overrides)
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export interface ExplanationFamilyRecord {
  explanationFamilyId: string;
  sharedExplanationId: string;
  madhhabExplanations: {
    HANAFI?: string | null;
    MALIKI?: string | null;
    SHAFII?: string | null;
    HANBALI?: string | null;
    JAFARI?: string | null;
  };
  description: string;
}
