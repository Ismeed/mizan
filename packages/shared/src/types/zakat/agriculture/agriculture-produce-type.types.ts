/**
 * MIZAN — Agriculture Produce Type Contracts (Phase 10)
 */

export type AgricultureProduceTypeId =
  | 'WHEAT'
  | 'BARLEY'
  | 'DATES'
  | 'RAISINS'
  | 'RICE'
  | 'CORN'
  | 'MILLET'
  | 'LENTILS'
  | 'CHICKPEAS'
  | 'OLIVES'
  | 'OTHER_GRAIN'
  | 'OTHER_FRUIT'
  | 'OTHER_PRODUCE'
  | 'REVIEW_REQUIRED';

export type AgricultureProduceCategory =
  | 'GRAIN'
  | 'FRUIT'
  | 'LEGUME'
  | 'VEGETABLE'
  | 'OTHER';

export interface AgricultureProduceTypeRecord {
  produceTypeId: AgricultureProduceTypeId;
  version: string;
  schemaVersion: string;
  category: AgricultureProduceCategory;
  canonicalName: string;
  arabicTerm: string;
  storable: boolean; // whether it can be stored/preserved long-term
  localizationKeys: {
    labelKey: string;
    descriptionKey: string;
  };
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
