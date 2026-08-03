/**
 * MIZAN — Canonical Livestock Facts Model (Phase 9)
 *
 * Represents input facts per livestock asset instance.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';
import type { CanonicalZakatCategoryId } from '../canonical-zakat-category.types';

export type FeedingMethod = 'GRAZING' | 'FODDER_FED' | 'MIXED' | 'UNKNOWN';
export type PurposeClassification = 'BREEDING' | 'TRADE' | 'WORK' | 'DAIRY' | 'REVIEW_REQUIRED';

export interface LivestockAgeBreakdownItem {
  ageClassId?: string;
  ageYears?: number;
  count: number;
}

export interface LivestockSexBreakdownItem {
  sex: 'MALE' | 'FEMALE';
  count: number;
}

export interface LivestockHerdFacts {
  totalCount: number;
  ageBreakdown?: LivestockAgeBreakdownItem[];
  sexBreakdown?: LivestockSexBreakdownItem[];
  /** Breakdown for combined sheep & goat entries */
  composition?: {
    sheepCount: number;
    goatCount: number;
  };
}

export interface LivestockOwnershipFacts {
  ownershipStartDate?: string | null;
  ownershipDuration?: {
    value: number | null;
    unit: 'LUNAR_YEAR' | 'MONTH' | 'DAY';
  };
  hawlMet: boolean;
}

export interface LivestockFeedingFacts {
  method: FeedingMethod;
  details?: Record<string, unknown>;
}

export interface LivestockPurposeFacts {
  classification: PurposeClassification;
}

export interface LivestockJointOwnershipShare {
  ownerId: string;
  sharePercentage: number;
  shareCount: number;
}

export interface LivestockJointOwnershipFacts {
  isJointlyOwned: boolean;
  ownershipShares?: LivestockJointOwnershipShare[];
}

export interface CanonicalLivestockFacts {
  assetInstanceId: string;
  categoryId: CanonicalZakatCategoryId;
  animalTypeId: CanonicalAnimalTypeId;
  herd: LivestockHerdFacts;
  ownership: LivestockOwnershipFacts;
  feedingAndGrazing: LivestockFeedingFacts;
  purpose: LivestockPurposeFacts;
  jointOwnership: LivestockJointOwnershipFacts;
  location?: {
    countryCode: string;
    regionCode?: string;
  };
}
