/**
 * MIZAN — Result Subject Contract (Phase 13)
 * Every result item must clearly identify what it concerns.
 */

export type SubjectType =
  | 'HEIR'
  | 'ESTATE'
  | 'ESTATE_ITEM'
  | 'ZAKAT_CATEGORY'
  | 'ZAKAT_ASSET'
  | 'LIVESTOCK_ASSET'
  | 'ANIMAL_TYPE'
  | 'HARVEST'
  | 'HARVEST_GROUP'
  | 'PRODUCE_TYPE'
  | 'CURRENCY_CONVERSION'
  | 'CALCULATION';

export interface ResultSubject {
  subjectType: SubjectType;
  /** Permanent canonical identifier e.g. "FULL_BROTHER", "CASH_SAVINGS", "CATTLE" */
  subjectId: string;
  subjectVersion: string;
  /** Case-specific instance identifier e.g. "heir_instance_001" */
  instanceId: string;
}
