/**
 * MIZAN — AI Assistant Result Context Contract (Phase 13)
 * Structure and strict restrictions for packaging calculation results for AI context.
 */

import type { Madhhab } from '../inheritance.types';

export interface AIResultContextRestrictions {
  mustNotRecalculate: true;
  mustNotChangeResult: true;
  mustNotChangeMadhhab: true;
  mustNotInventRule: true;
  mustNotInventEvidence: true;
  mustNotInventFraction: true;
  mustNotInventRate: true;
  mustNotModifyMoney: true;
  mustUseProvidedResultContract: true;
  mustDiscloseInsufficientContext: true;
}

export interface AIResultCalculationContext {
  calculationId: string;
  resultId: string;
  module: 'MIRATH' | 'ZAKAT';
  selectedMadhhab: Madhhab;
  languageTag: string;
  knowledgeReleaseVersion: string;
  ruleEngineVersion: string;
}

export interface AIResultItemContext {
  resultItemId: string;
  itemType: string;
  subject: Record<string, unknown>;
  status: string;
  decision: Record<string, unknown>;
  exactValues: Record<string, unknown>;
  monetaryValues: unknown[];
}

export interface AIResultApprovedContext {
  appliedRules: unknown[];
  evidence: unknown[];
  explanations: unknown[];
}

export interface AIResultContextPackage {
  task: 'EXPLAIN_CALCULATION_RESULT' | 'ANSWER_RESULT_QUESTION';
  calculationContext: AIResultCalculationContext;
  resultContext: AIResultItemContext;
  approvedContext: AIResultApprovedContext;
  restrictions: AIResultContextRestrictions;
}
