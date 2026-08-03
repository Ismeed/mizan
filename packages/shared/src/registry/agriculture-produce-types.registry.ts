/**
 * MIZAN — Agriculture Produce Types Registry (Phase 10)
 *
 * Structural identity definitions for agricultural produce types.
 */

import type { AgricultureProduceTypeRecord } from '../types/zakat/agriculture/agriculture-produce-type.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'a'.repeat(64);

export const BASELINE_AGRICULTURE_PRODUCE_TYPES: AgricultureProduceTypeRecord[] = [
  {
    produceTypeId: 'WHEAT',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    category: 'GRAIN',
    canonicalName: 'Wheat (Qimh / Hinta)',
    arabicTerm: 'قمح',
    storable: true,
    localizationKeys: {
      labelKey: 'zakat.agriculture.produce.WHEAT.label',
      descriptionKey: 'zakat.agriculture.produce.WHEAT.description',
    },
    governance: { status: 'PRODUCTION' },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
  {
    produceTypeId: 'BARLEY',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    category: 'GRAIN',
    canonicalName: 'Barley (Sha\'ir)',
    arabicTerm: 'شعير',
    storable: true,
    localizationKeys: {
      labelKey: 'zakat.agriculture.produce.BARLEY.label',
      descriptionKey: 'zakat.agriculture.produce.BARLEY.description',
    },
    governance: { status: 'PRODUCTION' },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
  {
    produceTypeId: 'DATES',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    category: 'FRUIT',
    canonicalName: 'Dates (Tamr)',
    arabicTerm: 'تمر',
    storable: true,
    localizationKeys: {
      labelKey: 'zakat.agriculture.produce.DATES.label',
      descriptionKey: 'zakat.agriculture.produce.DATES.description',
    },
    governance: { status: 'PRODUCTION' },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
  {
    produceTypeId: 'RAISINS',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    category: 'FRUIT',
    canonicalName: 'Raisins (Zabib)',
    arabicTerm: 'زبيب',
    storable: true,
    localizationKeys: {
      labelKey: 'zakat.agriculture.produce.RAISINS.label',
      descriptionKey: 'zakat.agriculture.produce.RAISINS.description',
    },
    governance: { status: 'PRODUCTION' },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
  {
    produceTypeId: 'RICE',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    category: 'GRAIN',
    canonicalName: 'Rice (Aruzz)',
    arabicTerm: 'أرز',
    storable: true,
    localizationKeys: {
      labelKey: 'zakat.agriculture.produce.RICE.label',
      descriptionKey: 'zakat.agriculture.produce.RICE.description',
    },
    governance: { status: 'PRODUCTION' },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
];
