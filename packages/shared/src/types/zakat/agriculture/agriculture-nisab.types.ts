/**
 * MIZAN — Agriculture Nisab Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';
import type { AgricultureProduceTypeId } from './agriculture-produce-type.types';

export type AgricultureNisabModelType = 'WEIGHT_THRESHOLD' | 'REVIEW_REQUIRED';
export type AgricultureNisabUnit = 'WASQ' | 'KG' | 'TONNE' | 'LOCAL_UNIT';

export interface AgricultureNisabRecord {
  /** Format: ZAKAT-AGRI-NISAB-<PRODUCE>-<SEQ> */
  nisabId: string;
  version: string;
  schemaVersion: string;
  produceTypeScope: AgricultureProduceTypeId[];
  madhhabScope: {
    appliesTo: string[];
  };
  modelType: AgricultureNisabModelType;
  thresholdQuantity: ExactFraction;
  unit: AgricultureNisabUnit;
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
