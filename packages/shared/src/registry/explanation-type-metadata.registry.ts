/**
 * Explanation Type Metadata Registry
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { ExplanationType } from '../types/explanation/explanation-types.types';

export interface ExplanationTypeMetadata {
  type: ExplanationType;
  description: string;
  allowedModules: ('MIRATH' | 'ZAKAT' | 'SHARED')[];
  requiresEvidence: boolean;
  requiresReview: boolean;
}

export const EXPLANATION_TYPE_METADATA: Record<ExplanationType, ExplanationTypeMetadata> = {
  CALCULATION_DECISION: {
    type: 'CALCULATION_DECISION',
    description: 'Explains why a specific calculation decision was applied',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: true,
  },
  ELIGIBILITY: {
    type: 'ELIGIBILITY',
    description: 'Explains why a person, asset, produce type, or livestock category qualified or did not qualify',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: true,
  },
  FIXED_SHARE: {
    type: 'FIXED_SHARE',
    description: 'Explains an approved Mirath fixed-share decision (Fard)',
    allowedModules: ['MIRATH'],
    requiresEvidence: true,
    requiresReview: true,
  },
  RESIDUARY_STATUS: {
    type: 'RESIDUARY_STATUS',
    description: 'Explains an approved residuary status (Asabah)',
    allowedModules: ['MIRATH'],
    requiresEvidence: true,
    requiresReview: true,
  },
  HIJAB_COMPLETE_EXCLUSION: {
    type: 'HIJAB_COMPLETE_EXCLUSION',
    description: 'Explains why an heir was completely blocked (Hijab Hirman)',
    allowedModules: ['MIRATH'],
    requiresEvidence: true,
    requiresReview: true,
  },
  HIJAB_PARTIAL_EFFECT: {
    type: 'HIJAB_PARTIAL_EFFECT',
    description: 'Explains a share reduction or status transformation (Hijab Nuqsan)',
    allowedModules: ['MIRATH'],
    requiresEvidence: true,
    requiresReview: true,
  },
  NISAB_RESULT: {
    type: 'NISAB_RESULT',
    description: 'Explains whether the applicable nisab threshold was reached',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  HOLDING_PERIOD_RESULT: {
    type: 'HOLDING_PERIOD_RESULT',
    description: 'Explains an approved hawl or ownership-period decision',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  ZAKAT_RATE: {
    type: 'ZAKAT_RATE',
    description: 'Explains an approved Zakat rate (e.g. 2.5%, 5%, 10%)',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  LIVESTOCK_SCHEDULE_RESULT: {
    type: 'LIVESTOCK_SCHEDULE_RESULT',
    description: 'Explains a livestock schedule band, pattern, or obligation',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  AGRICULTURE_IRRIGATION_RESULT: {
    type: 'AGRICULTURE_IRRIGATION_RESULT',
    description: 'Explains the resolved irrigation classification and corresponding rate',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  AGRICULTURE_AGGREGATION_RESULT: {
    type: 'AGRICULTURE_AGGREGATION_RESULT',
    description: 'Explains why harvests were combined or kept separate',
    allowedModules: ['ZAKAT'],
    requiresEvidence: true,
    requiresReview: true,
  },
  DEDUCTION_RESULT: {
    type: 'DEDUCTION_RESULT',
    description: 'Explains why a cost or liability was accepted or rejected',
    allowedModules: ['ZAKAT', 'MIRATH'],
    requiresEvidence: false,
    requiresReview: true,
  },
  EVIDENCE_EXPLANATION: {
    type: 'EVIDENCE_EXPLANATION',
    description: 'Explains how a Qur’an verse, Hadith, or scholarly reference relates to a decision',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: true,
    requiresReview: true,
  },
  WARNING: {
    type: 'WARNING',
    description: 'Provides an approved calculation warning',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: true,
  },
  REVIEW_REQUIRED: {
    type: 'REVIEW_REQUIRED',
    description: 'Explains why the case requires qualified scholar review',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: true,
  },
  UNSUPPORTED_CASE: {
    type: 'UNSUPPORTED_CASE',
    description: 'Explains that the current production release does not support a case',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: false,
  },
  EDUCATIONAL_NOTE: {
    type: 'EDUCATIONAL_NOTE',
    description: 'Provides approved educational information that does not change the result',
    allowedModules: ['MIRATH', 'ZAKAT', 'SHARED'],
    requiresEvidence: false,
    requiresReview: true,
  },
};
