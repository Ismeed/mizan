/** Rich share result from the Mirath engine */
export interface ShareResult {
  key: string;
  label: string;
  count: number;
  shareType: 'FARD' | 'ASABAH' | 'BLOCKED' | 'NONE';
  /** Human-readable fraction e.g. "½", "1/6", "Residue" */
  fractionLabel: string;
  fractionNumerator: number;
  fractionDenominator: number;
  /** Proportion of the total estate [0-1] */
  shareOfEstate: number;
  /** Total amount for the whole heir group */
  totalAmount: number;
  /** Amount per individual heir */
  perPersonAmount: number;
  isBlocked: boolean;
  blockingReason?: string;
  /** Quranic or classical-text reference */
  reference?: string;
}

/** Full result returned by inheritanceService.calculate() */
export interface InheritanceResult {
  netEstate: number;
  shares: ShareResult[];
  totalAllocated: number;
  unallocated: number;
  /** How the calculation was resolved */
  calculationMethod: 'NORMAL' | 'AWL' | 'RADD';
  /** > 1 when AWL was applied — shares were scaled down by this factor */
  awlFactor?: number;
  madhhab: string;
}

/** Legacy alias kept for any existing code references */
export interface ShareAmount {
  heir: string;
  fraction: string;
  amount: number;
}
