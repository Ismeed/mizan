/**
 * Rendered Explanation & Snapshot Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationResolutionStatus } from './explanation-types.types';
import { RenderedVariableValue } from './explanation-variable.types';

export interface ExplanationEvidenceCitation {
  evidenceId: string;
  evidenceVersion: string;
  shortCitation: string;
}

export interface ExplanationSourceReference {
  ruleId: string;
  ruleVersion: string;
  knowledgeReleaseVersion: string;
}

export interface RenderedExplanationContent {
  title: string;
  short: string;
  full: string;
  educational: string | null;
}

export interface RenderedExplanationLanguage {
  requestedLanguageTag: string;
  resolvedLanguageTag: string;
  locale: string;
  direction: 'LTR' | 'RTL';
  fallbackUsed: boolean;
  fallbackReason?: string;
}

export interface RenderedExplanationMadhhab {
  madhhabId: string;
  scopeValidated: boolean;
}

export interface RenderedExplanation {
  renderedExplanationId: string;
  explanationId: string;
  explanationVersion: string;
  status: ExplanationResolutionStatus;
  language: RenderedExplanationLanguage;
  madhhab: RenderedExplanationMadhhab;
  content: RenderedExplanationContent;
  variables: RenderedVariableValue[];
  evidence: ExplanationEvidenceCitation[];
  source: ExplanationSourceReference;
  integrity: {
    renderedChecksum: string;
  };
}

export interface ExplanationResolutionStep {
  sequence: number;
  action: string;
  [key: string]: any;
}

export interface ExplanationResolutionTrace {
  traceId: string;
  explanationId: string;
  steps: ExplanationResolutionStep[];
  timestamp: string;
}

export interface ExplanationSnapshot {
  snapshotId: string;
  calculationId: string;
  resultItemId: string;
  explanationId: string;
  explanationVersion: string;
  languageTag: string;
  locale: string;
  renderedContent: RenderedExplanationContent;
  variableValues: RenderedVariableValue[];
  evidenceVersions: string[];
  selectedMadhhab: string;
  knowledgeReleaseVersion: string;
  renderedChecksum: string;
  createdAt: string;
  isImmutable: boolean;
}
