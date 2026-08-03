/**
 * Canonical Explanation Record Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationModuleId, ExplanationType, MadhhabScopeMode } from './explanation-types.types';

export interface ExplanationIdentity {
  module: ExplanationModuleId;
  explanationType: ExplanationType;
  topic: string;
  subtopic?: string;
}

export interface ExplanationRelationships {
  ruleIds: string[];
  ruleFamilyIds: string[];
  evidenceIds: string[];
  heirIds: string[];
  zakatCategoryIds: string[];
  livestockScheduleIds: string[];
  agricultureRuleIds: string[];
}

export interface ExplanationMadhhabScope {
  mode: MadhhabScopeMode;
  appliesTo: string[];
  excludedMadhhabs: string[];
}

export interface ExplanationDisplayConfig {
  shortVersionAvailable: boolean;
  fullVersionAvailable: boolean;
  educationalVersionAvailable: boolean;
  showEvidenceLinks: boolean;
  showMadhhabLabel: boolean;
}

export interface ExplanationReferences {
  evidenceIds: string[];
  fiqhReferenceIds: string[];
  sourceRecordIds: string[];
}

export interface ExplanationGovernance {
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'PRODUCTION';
  reviewMetadata: Record<string, any>;
  effectiveFrom: string | null;
  effectiveUntil: string | null;
  reviewedBy?: string[];
  approvedBy?: string[];
}

export interface ExplanationIntegrity {
  contentChecksum: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isTestFixture?: boolean;
}

export interface ExplanationRecord {
  explanationId: string;
  version: string;
  schemaVersion: string;
  identity: ExplanationIdentity;
  relationships: ExplanationRelationships;
  madhhabScope: ExplanationMadhhabScope;
  content: {
    defaultLanguageTag: string;
    translations: Record<string, string>; // languageTag -> translationRecordId / text
  };
  variables: string[]; // variableIds
  display: ExplanationDisplayConfig;
  references: ExplanationReferences;
  governance: ExplanationGovernance;
  integrity: ExplanationIntegrity;
}
