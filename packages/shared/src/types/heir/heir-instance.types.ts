/**
 * MIZAN — Heir Instance & Normalization Contract (Phase 7)
 *
 * Represents an heir entered into a specific calculation case,
 * and the output of the HeirNormalizationService.
 */

import type { CanonicalHeirId } from './canonical-heir.types';

export type HeirInputSource = 'USER_SELECTION' | 'IMPORT' | 'MIGRATION';

export type HeirNormalizationStatus =
  | 'RESOLVED'
  | 'AMBIGUOUS'
  | 'UNSUPPORTED'
  | 'REVIEW_REQUIRED';

export interface HeirPersonInstance {
  personInstanceId: string;
  displayName?: string | null;
}

export interface HeirInstanceRecord {
  heirInstanceId: string;
  calculationId?: string;
  heirId: CanonicalHeirId;
  entityVersion: string;
  count: number;
  optionalPersons?: HeirPersonInstance[];
  inputSource: HeirInputSource;
  originalInput: {
    languageTag: string;
    displayValue: string;
  };
  normalization: {
    status: HeirNormalizationStatus;
    aliasId?: string | null;
    confirmedByUser: boolean;
  };
}

export interface HeirNormalizationRequest {
  input: string;
  languageTag: string;
  selectedMadhhab?: string;
  knowledgeReleaseVersion?: string;
}

export interface HeirNormalizationOption {
  heirId: CanonicalHeirId;
  localizedLabel: string;
  description?: string;
}

export interface HeirNormalizationResult {
  status: HeirNormalizationStatus;
  originalInput: string;
  resolvedHeirId?: CanonicalHeirId;
  matchedAliasId?: string;
  confidenceMode?: 'EXACT_APPROVED_ALIAS' | 'EXACT_CANONICAL_ID' | 'SUGGESTION';
  requiresUserConfirmation: boolean;
  options?: HeirNormalizationOption[];
  message?: string;
}
