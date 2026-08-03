/**
 * MIZAN — Baseline Synthetic Agriculture Rates Registry (Phase 10)
 *
 * ALL records are synthetic fixtures tagged TEST_ONLY_FIXTURE.
 * Rates are exact fractions (1/10 for rain-fed, 1/20 for irrigated), never floating-point decimals.
 */

import type { AgricultureRateRecord } from '../types/zakat/agriculture/agriculture-rate.types';

const NOW = '2026-08-01T00:00:00.000Z';
const CHECKSUM = 'c'.repeat(64);

export const BASELINE_SYNTHETIC_AGRICULTURE_RATES: AgricultureRateRecord[] = [
  {
    rateId: 'ZAKAT-AGRI-RATE-RAIN-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    irrigationMethod: 'RAIN_FED',
    rate: { numerator: 1n, denominator: 10n }, // 1/10 (10%) exact fraction
    evidenceIds: ['EVID-HADITH-USHRI-SYNTHETIC'],
    explanationIds: ['EXPL-AGRI-RATE-RAIN'],
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
    rateId: 'ZAKAT-AGRI-RATE-IRRIGATED-001',
    version: '1.0.0',
    schemaVersion: '1.0.0',
    madhhabScope: {
      appliesTo: ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'],
    },
    irrigationMethod: 'IRRIGATED_WITH_COST',
    rate: { numerator: 1n, denominator: 20n }, // 1/20 (5%) exact fraction
    evidenceIds: ['EVID-HADITH-HALF-USHRI-SYNTHETIC'],
    explanationIds: ['EXPL-AGRI-RATE-IRRIGATED'],
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
