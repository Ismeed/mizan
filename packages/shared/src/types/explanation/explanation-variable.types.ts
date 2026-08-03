/**
 * Explanation Variable Definitions & Types
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export type ExplanationVariableId =
  | 'HEIR_NAME'
  | 'BLOCKED_HEIR_NAME'
  | 'BLOCKER_HEIR_NAME'
  | 'ZAKAT_CATEGORY_NAME'
  | 'PRODUCE_TYPE_NAME'
  | 'ANIMAL_TYPE_NAME'
  | 'SHARE_FRACTION'
  | 'SHARE_PERCENTAGE'
  | 'MONETARY_AMOUNT'
  | 'CURRENCY_CODE'
  | 'NISAB_AMOUNT'
  | 'HARVEST_QUANTITY'
  | 'LIVESTOCK_COUNT'
  | 'SELECTED_MADHHAB'
  | 'EVIDENCE_REFERENCE'
  | 'CALCULATION_DATE'
  | 'IRRIGATION_METHOD_NAME'
  | 'RATE_FRACTION'
  | 'OBLIGATION_QUANTITY'
  | 'UNIT_NAME';

export type ExplanationVariableValueType =
  | 'FRACTION'
  | 'INTEGER'
  | 'DECIMAL'
  | 'MONEY'
  | 'DATE'
  | 'ENTITY_LABEL'
  | 'CATEGORY_LABEL'
  | 'TEXT'
  | 'EVIDENCE_REFERENCE';

export interface ExplanationVariableDefinition {
  variableId: ExplanationVariableId;
  valueType: ExplanationVariableValueType;
  sourcePath: string;
  required: boolean;
  formattingPolicyId: string;
  allowedSources: string[];
  fallbackBehaviour: 'FAIL_RENDERING' | 'USE_DEFAULT_TEXT' | 'OMIT';
  description: string;
}

export interface RenderedVariableValue {
  variableId: ExplanationVariableId;
  sourceValue: any;
  renderedValue: string;
}
