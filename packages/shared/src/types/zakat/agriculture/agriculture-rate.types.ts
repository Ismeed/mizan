/**
 * MIZAN — Agriculture Rate Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';
import type { AgricultureIrrigationMethod } from './agriculture-irrigation.types';

export type AgricultureRateModelType = 'IRRIGATION_METHOD_SPLIT' | 'SINGLE_RATE' | 'REVIEW_REQUIRED';

export interface AgricultureRateRecord {
  /** Format: ZAKAT-AGRI-RATE-<METHOD>-<SEQ> */
  rateId: string;
  version: string;
  schemaVersion: string;
  madhhabScope: {
    appliesTo: string[];
  };
  irrigationMethod: AgricultureIrrigationMethod;
  rate: ExactFraction; // e.g. 1/10 for rain-fed, 1/20 for irrigated
  evidenceIds: string[];
  explanationIds: string[];
  governance: {
    status: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
    isTestFixture?: boolean;
    fixtureTag?: 'TEST_ONLY_FIXTURE';
  };
  integrity: {
    contentChecksum: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
  };
}
