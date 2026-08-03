/**
 * MIZAN — Baseline Synthetic Agriculture Nisab Registry (Phase 10)
 *
 * ALL records are synthetic fixtures tagged TEST_ONLY_FIXTURE. Zero production values.
 */

import type { AgricultureNisabRecord } from '../types/zakat/agriculture/agriculture-nisab.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'b'.repeat(64);

export const BASELINE_SYNTHETIC_AGRICULTURE_NISAB: AgricultureNisabRecord[] = [
  {
    nisabId: 'ZAKAT-AGRI-NISAB-WHEAT-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    produceTypeScope: ['WHEAT', 'BARLEY', 'RICE'],
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    modelType: 'WEIGHT_THRESHOLD',
    thresholdQuantity: { numerator: 5n, denominator: 1n }, // 5 Wasq (synthetic)
    unit: 'WASQ',
    evidenceIds: ['EVID-HADITH-5-WASQ-SYNTHETIC'],
    explanationIds: ['EXPL-AGRI-NISAB-WASQ'],
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
  {
    nisabId: 'ZAKAT-AGRI-NISAB-DATES-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    produceTypeScope: ['DATES', 'RAISINS'],
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    modelType: 'WEIGHT_THRESHOLD',
    thresholdQuantity: { numerator: 5n, denominator: 1n }, // 5 Wasq (synthetic)
    unit: 'WASQ',
    evidenceIds: ['EVID-HADITH-5-WASQ-SYNTHETIC'],
    explanationIds: ['EXPL-AGRI-NISAB-WASQ'],
    governance: {
      status: 'APPROVED',
      isTestFixture: true,
      fixtureTag: 'TEST_ONLY_FIXTURE',
    },
    integrity: {
      contentChecksum: CHECKSUM,
      createdAt: NOW,
      createdBy: 'SYSTEM_BASELINE',
      updatedAt: NOW,
      updatedBy: 'SYSTEM_BASELINE',
    },
  },
];
