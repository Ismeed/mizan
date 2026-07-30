export enum AssetType {
  CASH = 'CASH',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BUSINESS_INVENTORY = 'BUSINESS_INVENTORY',
  AGRICULTURAL = 'AGRICULTURAL',
  LIVESTOCK = 'LIVESTOCK'
}

export interface ZakatInput {
  assets: Array<{ type: AssetType; value: number }>;
  liabilities: number;
  goldPricePerGram: number;
  silverPricePerGram: number;
}

export interface ZakatResult {
  totalAssets: number;
  netAssets: number;
  nisabThreshold: number;
  isEligible: boolean;
  zakatPayable: number;
}
