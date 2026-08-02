/**
 * MIZAN — Heir Lineage Path Types (Phase 7)
 *
 * Defines machine-readable lineage path structures connecting heirs to the deceased.
 * Used for family-tree visualization, duplicate detection, and relationship validation.
 *
 * CRITICAL: Lineage paths MUST NOT be used to infer Islamic inheritance eligibility.
 * Eligibility is determined strictly by the scholar-approved Rule Engine.
 */

export type DirectLineageStep = 'FATHER' | 'MOTHER' | 'SON' | 'DAUGHTER';

export interface SharedParentStep {
  sharedParent: 'FATHER' | 'MOTHER' | 'BOTH';
}

export type LineagePathEntry = DirectLineageStep | SharedParentStep;

export interface HeirLineagePath {
  heirId: string;
  path: LineagePathEntry[];
  descriptionEn?: string;
}
