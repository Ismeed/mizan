/**
 * Islamic Inheritance (Mirath) Types
 * Based on Quran 4:11-12, 4:176 and classical fiqh texts.
 */

/** All recognised heir categories in the Hanafi rule engine */
export enum HeirType {
  HUSBAND = 'HUSBAND',
  WIFE = 'WIFE',
  SON = 'SON',
  DAUGHTER = 'DAUGHTER',
  FATHER = 'FATHER',
  MOTHER = 'MOTHER',
  PATERNAL_GRANDFATHER = 'PATERNAL_GRANDFATHER',
  PATERNAL_GRANDMOTHER = 'PATERNAL_GRANDMOTHER',
  MATERNAL_GRANDMOTHER = 'MATERNAL_GRANDMOTHER',
  FULL_BROTHER = 'FULL_BROTHER',
  FULL_SISTER = 'FULL_SISTER',
  PATERNAL_HALF_BROTHER = 'PATERNAL_HALF_BROTHER',
  PATERNAL_HALF_SISTER = 'PATERNAL_HALF_SISTER',
  MATERNAL_HALF_SIBLING = 'MATERNAL_HALF_SIBLING',
  SON_OF_FULL_BROTHER = 'SON_OF_FULL_BROTHER',
  SON_OF_PATERNAL_HALF_BROTHER = 'SON_OF_PATERNAL_HALF_BROTHER',
  PATERNAL_UNCLE = 'PATERNAL_UNCLE',
  SON_OF_PATERNAL_UNCLE = 'SON_OF_PATERNAL_UNCLE',
}

/** Supported Islamic legal schools */
export type Madhhab = 'HANAFI' | 'MALIKI' | 'SHAFII' | 'HANBALI' | 'JAFARI';

/** Input counts for each heir category */
export interface HeirsInput {
  husband: number;
  wives: number;
  sons: number;
  daughters: number;
  father: number;
  mother: number;
  paternalGrandfathers: number;
  paternalGrandmothers: number;
  maternalGrandmothers: number;
  fullBrothers: number;
  fullSisters: number;
  paternalHalfBrothers: number;
  paternalHalfSisters: number;
  maternalHalfSiblings: number;
  sonsOfFullBrothers: number;
  sonsOfPatHalfBrothers: number;
  paternalUncles: number;
  sonsOfPatUncles: number;
}

/** How a specific heir group receives their share */
export type ShareType = 'FARD' | 'ASABAH' | 'BLOCKED' | 'NONE';

/** The calculated share for a single heir group */
export interface HeirShareResult {
  key: keyof HeirsInput;
  label: string;
  count: number;
  shareType: ShareType;
  /** Human-readable fraction label e.g. "1/4", "2/3 (shared)", "Residue" */
  fractionLabel: string;
  /** Numerator of the final share fraction */
  fractionNumerator: number;
  /** Denominator of the final share fraction */
  fractionDenominator: number;
  /** Decimal share of the total estate [0-1] */
  shareOfEstate: number;
  /** Total monetary amount for the whole group */
  totalAmount: number;
  /** Amount per individual heir in this group */
  perPersonAmount: number;
  isBlocked: boolean;
  blockingReason?: string;
  /** Quranic or classical-text reference */
  reference?: string;
}

/** The full Mirath calculation result */
export interface MirathResult {
  netEstate: number;
  shares: HeirShareResult[];
  totalAllocated: number;
  unallocated: number;
  /** NORMAL: clean distribution; AWL: Fard > estate so reduced proportionally;
   *  RADD: surplus returned to Fard heirs */
  calculationMethod: 'NORMAL' | 'AWL' | 'RADD';
  /** Only set when method is AWL; > 1 means shares were scaled down */
  awlFactor?: number;
  madhhab: Madhhab;
}

/** Full input to the Mirath engine */
export interface MirathInput {
  /** Net estate after debts, funeral expenses, and wasiyyah (max 1/3) */
  netEstate: number;
  heirs: HeirsInput;
  madhhab?: Madhhab;
}

/** Legacy minimal types kept for backward-compat */
export interface InheritanceInput {
  totalAssetValue: number;
  heirs: Array<{ type: HeirType; count: number }>;
}
