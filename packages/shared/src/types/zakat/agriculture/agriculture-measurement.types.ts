/**
 * MIZAN — Agriculture Measurement Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';
import type { AgricultureNisabUnit } from './agriculture-nisab.types';

export type CanonicalMeasurementUnitId = 'WASQ' | 'KG' | 'TONNE' | 'SA' | 'MUDD' | 'LOCAL_UNIT_PLACEHOLDER';

export interface AgricultureMeasurementUnitRecord {
  unitId: CanonicalMeasurementUnitId;
  canonicalName: string;
  arabicTerm: string;
  isVolumeBased: boolean;
  isWeightBased: boolean;
  description: string;
}

export interface AgricultureUnitConversionRecord {
  conversionId: string;
  fromUnit: CanonicalMeasurementUnitId;
  toUnit: CanonicalMeasurementUnitId;
  conversionFactor: ExactFraction; // e.g. 1 Wasq = 130.56 kg (synthetic placeholder)
  produceTypeId?: string; // unit conversion may be produce-specific (e.g. density)
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
}
