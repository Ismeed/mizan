/**
 * MIZAN — Heir Availability Service (Phase 7)
 *
 * Evaluates whether a canonical heir entity is supported as an input
 * under the user's selected madhhab and captured knowledge release.
 *
 * IMPORTANT: Input availability != inheritance eligibility.
 * Availability indicates if the app UI allows entering this heir.
 */

import {
  CanonicalHeirId,
  HeirAvailabilityRequest,
  HeirAvailabilityResult,
} from '@mizan/shared';
import { HeirRegistryService } from './heir-registry.service';

export class HeirAvailabilityService {
  /**
   * Resolves the input support status for a specific heir ID under a madhhab.
   */
  static async getHeirAvailability(
    request: HeirAvailabilityRequest
  ): Promise<HeirAvailabilityResult> {
    const entity = await HeirRegistryService.getHeirById(request.heirId);

    if (!entity) {
      return {
        heirId: request.heirId,
        inputSupportStatus: 'NOT_SUPPORTED',
        selectedMadhhab: request.madhhab,
        entityVersion: '1.0.0',
        localizedExplanation: `The heir ID ${request.heirId} is not recognized in the registry.`,
      };
    }

    const madhhabDetail = entity.madhhabMetadata[request.madhhab] ?? {
      inputSupportStatus: 'NOT_YET_MODELLED',
    };

    let explanation: string | undefined;
    if (madhhabDetail.inputSupportStatus === 'NOT_SUPPORTED') {
      explanation = `Input for ${entity.relationship.canonicalName} is not supported under ${request.madhhab} jurisprudence in this release.`;
    } else if (madhhabDetail.inputSupportStatus === 'NOT_YET_MODELLED') {
      explanation = `Detailed rules for ${entity.relationship.canonicalName} under ${request.madhhab} are pending scholar review.`;
    } else if (madhhabDetail.inputSupportStatus === 'REVIEW_REQUIRED') {
      explanation = `Entering ${entity.relationship.canonicalName} under ${request.madhhab} requires formal scholar review.`;
    }

    return {
      heirId: request.heirId,
      inputSupportStatus: madhhabDetail.inputSupportStatus,
      selectedMadhhab: request.madhhab,
      entityVersion: entity.version,
      localizedExplanation: explanation,
    };
  }
}
