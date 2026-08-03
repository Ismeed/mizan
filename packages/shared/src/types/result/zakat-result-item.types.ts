/**
 * MIZAN — Zakat Result Item Payloads (Phase 13)
 * Strongly-typed decision payloads for Zakat result items.
 */

export interface ZakatCategoryResultPayload {
  eligibilityStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'EXEMPT';
  nisabStatus: 'REACHED' | 'NOT_REACHED' | 'EXEMPT';
  holdingPeriodStatus: 'SATISFIED' | 'NOT_SATISFIED' | 'NOT_APPLICABLE';
  obligationType: 'MONETARY_AMOUNT' | 'PHYSICAL_ANIMAL' | 'PHYSICAL_PRODUCE' | 'EXEMPT';
}

export interface ZakatNisabResultPayload {
  nisabMethod: 'GOLD' | 'SILVER' | 'LOWER' | 'HIGHER' | 'PRODUCE_NISAB';
  thresholdReferenceGrams?: number;
  comparisonBaseMinor: string;
  nisabThresholdMinor: string;
  status: 'REACHED' | 'NOT_REACHED';
}

export interface AnimalObligationItem {
  animalTypeId: string;
  animalClassId: string;
  ageYears: number;
  gender?: 'FEMALE' | 'MALE' | 'ANY';
  quantity: number;
  description: string;
}

export interface LivestockObligationResultPayload {
  animalTypeId: 'CAMEL' | 'CATTLE' | 'SHEEP_GOAT';
  scheduleId: string;
  scheduleVersion: string;
  matchedBandId: string;
  matchedPatternId?: string | null;
  obligationDefinitionId: string;
  animalObligations: AnimalObligationItem[];
  alternativeOptions?: AnimalObligationItem[];
}

export interface AgricultureObligationResultPayload {
  produceTypeId: string;
  harvestGroupId: string;
  nisabStatus: 'REACHED' | 'NOT_REACHED';
  irrigationClassification: 'RAIN_FED' | 'IRRIGATED' | 'MIXED_HARVEST';
  deductionStatus: 'NO_DEDUCTIONS' | 'PRODUCTION_COSTS_DEDUCTED';
  obligationType: 'PHYSICAL_PRODUCE';
}
