/**
 * MIZAN — Livestock Animal Type Identifiers and Registry Contracts (Phase 9)
 *
 * Defines canonical animal species identifiers for Livestock Zakat.
 * Must NOT contain translated terms or screen labels.
 */

export type CanonicalAnimalTypeId =
  | 'CAMEL'                           // Camels (Ibil)
  | 'CATTLE'                          // Cattle and Buffalo (Baqar)
  | 'SHEEP'                           // Sheep (Dha'n)
  | 'GOAT'                            // Goats (Ma'iz)
  | 'SHEEP_OR_GOAT'                   // Either Sheep or Goat (Ghanam)
  | 'OTHER_LIVESTOCK_REVIEW_REQUIRED'; // Unclassified species

export interface LivestockAnimalTypeTitles {
  en: string;
  ha?: string;
  ar?: string;
  transliterationAr?: string;
}

export interface LivestockAnimalTypeRecord {
  animalTypeId: CanonicalAnimalTypeId;
  version: string;
  canonicalName: string;
  categoryId: string;
  titles: LivestockAnimalTypeTitles;
  supportedAgeBases: string[];
  supportedSexRequirements: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    effectiveFrom: string;
  };
  integrity: {
    contentChecksum: string;
  };
}
