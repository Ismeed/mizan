/**
 * MIZAN — Livestock Animal Class Registry Contracts (Phase 9)
 *
 * Defines obligation animal classes (age, sex, development stage) as
 * permanent immutable records separate from owned herd facts.
 */

import type { CanonicalAnimalTypeId } from './livestock-animal-type.types';

export type AgeBasis =
  | 'EXACT_AGE'
  | 'MINIMUM_AGE'
  | 'AGE_RANGE'
  | 'SOURCE_DEFINED_CLASS';

export type AgeUnit =
  | 'LUNAR_YEAR'
  | 'SOLAR_YEAR'
  | 'MONTH'
  | 'SOURCE_DEFINED';

export type SexRequirement =
  | 'MALE'
  | 'FEMALE'
  | 'EITHER'
  | 'SOURCE_DEFINED';

export interface AnimalClassClassification {
  ageBasis: AgeBasis;
  minimumAge: number | null;
  maximumAge: number | null;
  ageUnit: AgeUnit;
  sexRequirement: SexRequirement;
  additionalConditions?: string[];
}

export interface AnimalClassTitles {
  en: string;
  ha?: string;
  ar?: string;
}

export interface AnimalClassSourceTerms {
  ar: string;
  transliterations: string[];
  scholarExplanationEn?: string;
}

export interface LivestockAnimalClassRecord {
  /** Permanent class ID, e.g. "CAMEL_BINT_MAKHAD", "CATTLE_TABI", "SHEEP_JADHA" */
  animalClassId: string;
  version: string;
  animalTypeId: CanonicalAnimalTypeId;
  classification: AnimalClassClassification;
  titles: AnimalClassTitles;
  sourceTerms: AnimalClassSourceTerms;
  evidenceIds: string[];
  governance: {
    status: 'DRAFT' | 'ACADEMIC_REVIEW' | 'SHARIA_REVIEW' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
  integrity: {
    contentChecksum: string;
  };
}
