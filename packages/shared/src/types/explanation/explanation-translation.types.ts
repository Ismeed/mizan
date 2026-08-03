/**
 * Explanation Translation Content Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export type TranslationType =
  | 'ORIGINAL_EXPLANATION'
  | 'APPROVED_TRANSLATION'
  | 'APPROVED_ADAPTATION'
  | 'EVIDENCE_TRANSLATION'
  | 'EVIDENCE_COMMENTARY';

export type TranslationStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'PRODUCTION';

export type TranslationGovernanceStage =
  | 'LINGUISTIC_REVIEW'
  | 'SHARIA_TERMINOLOGY_REVIEW'
  | 'TECHNICAL_VALIDATION'
  | 'APPROVED';

export interface ExplanationTranslationContent {
  title: string;
  short: string;
  full: string;
  educational: string | null;
  accessibilityText?: string;
}

export interface TranslationMetadata {
  translationType: TranslationType;
  translatedBy: string[];
  reviewedBy: string[];
  reviewedAt: string | null;
  sourceLanguageTag: string;
  translationStatus: TranslationStatus;
  governanceStage?: TranslationGovernanceStage;
  isTestFixture?: boolean;
}

export interface TranslationIntegrity {
  translationChecksum: string;
}

export interface ExplanationTranslationRecord {
  id?: string;
  explanationId: string;
  explanationVersion: string;
  languageTag: string;
  locale: string;
  direction: 'LTR' | 'RTL';
  content: ExplanationTranslationContent;
  terminologyVersion: string;
  translationMetadata: TranslationMetadata;
  integrity: TranslationIntegrity;
}
