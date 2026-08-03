/**
 * MIZAN — Baseline Livestock Animal Types Registry (Phase 9)
 *
 * Defines canonical animal species metadata.
 */

import type { LivestockAnimalTypeRecord } from '../types/zakat/livestock/livestock-animal-type.types';

export const BASELINE_LIVESTOCK_ANIMAL_TYPES: LivestockAnimalTypeRecord[] = [
  {
    animalTypeId: 'CAMEL',
    version: '1.0.0',
    canonicalName: 'Camel (Ibil)',
    categoryId: 'LIVESTOCK_CAMELS',
    titles: { en: 'Camel', ha: 'Rakumi', ar: 'إبل', transliterationAr: 'Ibil' },
    supportedAgeBases: ['EXACT_AGE', 'SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['FEMALE', 'MALE', 'EITHER'],
    governance: { status: 'PRODUCTION', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'CAMEL_TYPE_CHECKSUM_v1' },
  },
  {
    animalTypeId: 'CATTLE',
    version: '1.0.0',
    canonicalName: 'Cattle and Buffalo (Baqar)',
    categoryId: 'LIVESTOCK_CATTLE',
    titles: { en: 'Cattle / Cow', ha: 'Saniya / Sa\'a', ar: 'بقر', transliterationAr: 'Baqar' },
    supportedAgeBases: ['EXACT_AGE', 'MINIMUM_AGE', 'SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['FEMALE', 'MALE', 'EITHER'],
    governance: { status: 'PRODUCTION', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'CATTLE_TYPE_CHECKSUM_v1' },
  },
  {
    animalTypeId: 'SHEEP',
    version: '1.0.0',
    canonicalName: 'Sheep (Dha\'n)',
    categoryId: 'LIVESTOCK_SHEEP',
    titles: { en: 'Sheep', ha: 'Tunkiya', ar: 'ضأن', transliterationAr: 'Dha\'n' },
    supportedAgeBases: ['MINIMUM_AGE', 'SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['EITHER', 'FEMALE'],
    governance: { status: 'PRODUCTION', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'SHEEP_TYPE_CHECKSUM_v1' },
  },
  {
    animalTypeId: 'GOAT',
    version: '1.0.0',
    canonicalName: 'Goat (Ma\'iz)',
    categoryId: 'LIVESTOCK_GOATS',
    titles: { en: 'Goat', ha: 'Akwaiya', ar: 'ماعز', transliterationAr: 'Ma\'iz' },
    supportedAgeBases: ['MINIMUM_AGE', 'SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['EITHER', 'FEMALE'],
    governance: { status: 'PRODUCTION', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'GOAT_TYPE_CHECKSUM_v1' },
  },
  {
    animalTypeId: 'SHEEP_OR_GOAT',
    version: '1.0.0',
    canonicalName: 'Combined Sheep and Goat (Ghanam)',
    categoryId: 'LIVESTOCK_SHEEP_GOATS',
    titles: { en: 'Sheep or Goat', ha: 'Dabba / Tumaki da Awaki', ar: 'غنم', transliterationAr: 'Ghanam' },
    supportedAgeBases: ['MINIMUM_AGE', 'SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['EITHER', 'FEMALE'],
    governance: { status: 'PRODUCTION', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'SHEEP_OR_GOAT_TYPE_CHECKSUM_v1' },
  },
  {
    animalTypeId: 'OTHER_LIVESTOCK_REVIEW_REQUIRED',
    version: '1.0.0',
    canonicalName: 'Other Unclassified Livestock',
    categoryId: 'OTHER_LIVESTOCK_REVIEW_REQUIRED',
    titles: { en: 'Other Livestock (Scholar Review Required)', ha: 'Sauran Dabbobi', ar: 'حيوانات أخرى' },
    supportedAgeBases: ['SOURCE_DEFINED_CLASS'],
    supportedSexRequirements: ['EITHER'],
    governance: { status: 'DRAFT', effectiveFrom: '2026-01-01' },
    integrity: { contentChecksum: 'OTHER_LIVESTOCK_TYPE_CHECKSUM_v1' },
  },
];

export function getLivestockAnimalType(id: string): LivestockAnimalTypeRecord | undefined {
  return BASELINE_LIVESTOCK_ANIMAL_TYPES.find(t => t.animalTypeId === id);
}
