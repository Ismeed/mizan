/**
 * MIZAN — Heir Availability Resolution Contract (Phase 7)
 *
 * Checks whether a canonical heir entity is supported as an input
 * under a given madhhab and knowledge release.
 *
 * CRITICAL: Input availability does NOT equal inheritance eligibility.
 * Availability indicates whether the user can enter the heir count for rule processing.
 */

import type { CanonicalHeirId, HeirInputSupportStatus } from './canonical-heir.types';
import type { MadhhabCode } from '../profile.types';

export interface HeirAvailabilityRequest {
  heirId: CanonicalHeirId;
  madhhab: MadhhabCode;
  knowledgeReleaseVersion?: string;
}

export interface HeirAvailabilityResult {
  heirId: CanonicalHeirId;
  inputSupportStatus: HeirInputSupportStatus;
  selectedMadhhab: MadhhabCode;
  entityVersion: string;
  localizedExplanation?: string;
}
