/**
 * MIZAN — Agriculture Facts Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';
import type { CanonicalZakatCategoryId } from '../canonical-zakat-category.types';
import type { AgricultureProduceTypeId } from './agriculture-produce-type.types';
import type { AgricultureIrrigationMethod, MixedIrrigationRecord } from './agriculture-irrigation.types';
import type { AgricultureNisabUnit } from './agriculture-nisab.types';

export interface AgricultureHarvestFacts {
  harvestDate: string; // ISO date string
  produceTypeId: AgricultureProduceTypeId;
  quantity: ExactFraction;
  quantityUnit: AgricultureNisabUnit;
  qualityGrade?: 'SUPERIOR' | 'MEDIUM' | 'INFERIOR' | 'MIXED';
}

export interface AgricultureIrrigationFacts {
  method: AgricultureIrrigationMethod;
  mixedRecord?: MixedIrrigationRecord;
  irrigationCostBorne: boolean;
  irrigationCostEvidenceId?: string;
}

export interface AgricultureOwnershipFacts {
  ownershipStartDate: string;
  isFullOwner: boolean;
  ownershipShare?: ExactFraction; // for joint ownership or sharecropping
}

export interface AgricultureSeasonFacts {
  seasonId?: string;
  seasonLabel?: string;
  hijriYear?: number;
}

export interface CanonicalAgricultureFacts {
  assetInstanceId: string;
  categoryId: CanonicalZakatCategoryId; // 'AGRICULTURAL_PRODUCE'
  produceTypeId: AgricultureProduceTypeId;
  harvest: AgricultureHarvestFacts;
  irrigation: AgricultureIrrigationFacts;
  ownership: AgricultureOwnershipFacts;
  season?: AgricultureSeasonFacts;
}
