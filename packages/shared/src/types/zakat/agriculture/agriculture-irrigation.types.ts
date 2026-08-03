/**
 * MIZAN — Agriculture Irrigation Contracts (Phase 10)
 */

import type { ExactFraction } from '../../../utils/fraction.utils';

export type AgricultureIrrigationMethod =
  | 'RAIN_FED'
  | 'IRRIGATED_WITH_COST'
  | 'IRRIGATED_WITHOUT_COST'
  | 'SPRING_FED'
  | 'FLOOD_FED'
  | 'MIXED'
  | 'UNKNOWN';

export interface MixedIrrigationRecord {
  rainFedFraction: ExactFraction;
  irrigatedFraction: ExactFraction;
  mixedRuleId?: string;
  notes?: string;
}

export interface IrrigationClassification {
  primaryMethod: AgricultureIrrigationMethod;
  mixedRecord?: MixedIrrigationRecord;
  irrigationCostBorne: boolean;
  governanceStatus: 'DRAFT' | 'APPROVED' | 'PRODUCTION';
}
