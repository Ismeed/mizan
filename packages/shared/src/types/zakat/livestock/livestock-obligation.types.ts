/**
 * MIZAN — Livestock Obligation Definition Contracts (Phase 9)
 *
 * Reusable obligation definitions referenced by schedule bands and patterns.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';

export type LivestockObligationType =
  | 'NONE'
  | 'ANIMAL_DUE'
  | 'MULTIPLE_ANIMALS_DUE'
  | 'ALTERNATIVE_ANIMAL_OPTIONS'
  | 'COMBINATION_DUE'
  | 'MONETARY_EQUIVALENT'
  | 'REVIEW_REQUIRED';

export interface SingleAnimalObligation {
  animalTypeId: CanonicalAnimalTypeId;
  animalClassId: string;
  quantity: number;
  sexRequirement?: 'MALE' | 'FEMALE' | 'EITHER' | 'SOURCE_DEFINED';
  minimumAgeClassId?: string | null;
  maximumAgeClassId?: string | null;
}

export interface LivestockObligationOption {
  optionId: string;
  animalObligations: SingleAnimalObligation[];
  evidenceIds: string[];
}

export interface LivestockMonetaryAlternative {
  permitted: boolean;
  permissionRuleId?: string;
  valuationMethodRuleId?: string;
  valuationDate?: string;
  currencyCode?: string;
  amountMinor?: number;
  valuationSourceId?: string;
  selectedMadhhab?: string;
}

export interface LivestockObligationDefinition {
  obligationDefinitionId: string;
  version: string;
  obligationType: LivestockObligationType;
  animalObligations: SingleAnimalObligation[];
  alternativeOptions: LivestockObligationOption[];
  monetaryAlternative: LivestockMonetaryAlternative | null;
  evidenceIds: string[];
  explanationIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
}
