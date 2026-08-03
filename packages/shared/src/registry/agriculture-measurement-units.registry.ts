/**
 * MIZAN — Baseline Agriculture Measurement Units & Conversions Registry (Phase 10)
 */

import type {
  AgricultureMeasurementUnitRecord,
  AgricultureUnitConversionRecord,
} from '../types/zakat/agriculture/agriculture-measurement.types';

export const BASELINE_AGRICULTURE_MEASUREMENT_UNITS: AgricultureMeasurementUnitRecord[] = [
  {
    unitId: 'WASQ',
    canonicalName: 'Wasq (Classical Volume Unit)',
    arabicTerm: 'وسق',
    isVolumeBased: true,
    isWeightBased: false,
    description: 'Classical agricultural volume unit equal to 60 Sa\'.',
  },
  {
    unitId: 'KG',
    canonicalName: 'Kilogram',
    arabicTerm: 'كيلوجرام',
    isVolumeBased: false,
    isWeightBased: true,
    description: 'Metric unit of mass.',
  },
  {
    unitId: 'TONNE',
    canonicalName: 'Metric Tonne',
    arabicTerm: 'طن',
    isVolumeBased: false,
    isWeightBased: true,
    description: 'Metric unit equal to 1,000 kilograms.',
  },
  {
    unitId: 'SA',
    canonicalName: 'Sa\'',
    arabicTerm: 'صاع',
    isVolumeBased: true,
    isWeightBased: false,
    description: 'Classical volume unit equal to 4 Mudd.',
  },
  {
    unitId: 'MUDD',
    canonicalName: 'Mudd',
    arabicTerm: 'مد',
    isVolumeBased: true,
    isWeightBased: false,
    description: 'Classical volume unit equal to approximately two hands full.',
  },
];

export const BASELINE_SYNTHETIC_UNIT_CONVERSIONS: AgricultureUnitConversionRecord[] = [
  {
    conversionId: 'ZAKAT-AGRI-CONV-WASQ-KG-001',
    fromUnit: 'WASQ',
    toUnit: 'KG',
    conversionFactor: { numerator: 13056n, denominator: 100n }, // 130.56 kg per Wasq (synthetic fixture)
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
  },
  {
    conversionId: 'ZAKAT-AGRI-CONV-KG-WASQ-001',
    fromUnit: 'KG',
    toUnit: 'WASQ',
    conversionFactor: { numerator: 100n, denominator: 13056n },
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
  },
  {
    conversionId: 'ZAKAT-AGRI-CONV-TONNE-KG-001',
    fromUnit: 'TONNE',
    toUnit: 'KG',
    conversionFactor: { numerator: 1000n, denominator: 1n },
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
  },
];
