/**
 * MIZAN — Livestock Animal Class Registry (Phase 9 Synthetic Fixtures)
 *
 * CRITICAL GOVERNANCE NOTICE:
 * All records in this file are synthetic TEST_ONLY_FIXTURE definitions.
 * Zero production thresholds, age specifications, or obligations are populated here.
 */

import type { LivestockAnimalClassRecord } from '../types/zakat/livestock/livestock-animal-class.types';

export const BASELINE_SYNTHETIC_ANIMAL_CLASSES: LivestockAnimalClassRecord[] = [
  {
    animalClassId: 'SYNTHETIC_CAMEL_CLASS_01',
    version: '1.0.0',
    animalTypeId: 'CAMEL',
    classification: {
      ageBasis: 'SOURCE_DEFINED_CLASS',
      minimumAge: 1,
      maximumAge: 2,
      ageUnit: 'LUNAR_YEAR',
      sexRequirement: 'FEMALE',
    },
    titles: { en: 'Synthetic Camel Class (1-2 Lunar Years)', ar: 'إبل اصطناعية' },
    sourceTerms: { ar: 'بنت مخاض - تجريبي', transliterations: ['Bint Makhad (Synthetic Test Fixture)'] },
    evidenceIds: ['SYNTHETIC-EVIDENCE-001'],
    governance: {
      status: 'DRAFT',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
    integrity: { contentChecksum: 'SYNTHETIC_CAMEL_CLASS_01_CHECKSUM' },
  },
  {
    animalClassId: 'SYNTHETIC_CATTLE_CLASS_01',
    version: '1.0.0',
    animalTypeId: 'CATTLE',
    classification: {
      ageBasis: 'MINIMUM_AGE',
      minimumAge: 1,
      maximumAge: null,
      ageUnit: 'LUNAR_YEAR',
      sexRequirement: 'EITHER',
    },
    titles: { en: 'Synthetic Cattle Class (1+ Lunar Year)', ar: 'بقر اصطناعي' },
    sourceTerms: { ar: 'تبيع / تبيعة - تجريبي', transliterations: ['Tabi / Tabi\'ah (Synthetic Test Fixture)'] },
    evidenceIds: ['SYNTHETIC-EVIDENCE-002'],
    governance: {
      status: 'DRAFT',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
    integrity: { contentChecksum: 'SYNTHETIC_CATTLE_CLASS_01_CHECKSUM' },
  },
  {
    animalClassId: 'SYNTHETIC_SHEEP_GOAT_CLASS_01',
    version: '1.0.0',
    animalTypeId: 'SHEEP_OR_GOAT',
    classification: {
      ageBasis: 'MINIMUM_AGE',
      minimumAge: 1,
      maximumAge: null,
      ageUnit: 'LUNAR_YEAR',
      sexRequirement: 'EITHER',
    },
    titles: { en: 'Synthetic Sheep/Goat Class (1+ Lunar Year)', ar: 'غنم اصطناعي' },
    sourceTerms: { ar: 'شاة - تجريبي', transliterations: ['Shah (Synthetic Test Fixture)'] },
    evidenceIds: ['SYNTHETIC-EVIDENCE-003'],
    governance: {
      status: 'DRAFT',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
    integrity: { contentChecksum: 'SYNTHETIC_SHEEP_GOAT_CLASS_01_CHECKSUM' },
  },
];

export function getAnimalClassById(classId: string): LivestockAnimalClassRecord | undefined {
  return BASELINE_SYNTHETIC_ANIMAL_CLASSES.find(c => c.animalClassId === classId);
}
