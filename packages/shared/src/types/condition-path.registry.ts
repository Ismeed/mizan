/**
 * MIZAN — Condition Path Registry
 *
 * Defines every valid dot-separated path that rule conditions may reference.
 * The RuleValidator rejects any condition whose factsPath is not in this registry.
 *
 * Convention: paths use camelCase matching the canonical fact model interfaces.
 */

export const MIRATH_CONDITION_PATHS = [
  // Profile
  'profile.madhhab',
  'profile.currencyCode',
  'profile.region',
  // Estate
  'estate.netDistributableAmount',
  'estate.hasDebts',
  'estate.debtAmount',
  'estate.hasFuneralExpenses',
  'estate.hasWasiyyah',
  // Heir counts (Phase 7 Canonical ID paths)
  'canonicalHeirs.HUSBAND.count',
  'canonicalHeirs.HUSBAND.isPresent',
  'canonicalHeirs.WIFE.count',
  'canonicalHeirs.WIFE.isPresent',
  'canonicalHeirs.SON.count',
  'canonicalHeirs.SON.isPresent',
  'canonicalHeirs.DAUGHTER.count',
  'canonicalHeirs.DAUGHTER.isPresent',
  'canonicalHeirs.FATHER.count',
  'canonicalHeirs.FATHER.isPresent',
  'canonicalHeirs.MOTHER.count',
  'canonicalHeirs.MOTHER.isPresent',
  'canonicalHeirs.PATERNAL_GRANDFATHER.count',
  'canonicalHeirs.PATERNAL_GRANDFATHER.isPresent',
  'canonicalHeirs.PATERNAL_GRANDMOTHER.count',
  'canonicalHeirs.PATERNAL_GRANDMOTHER.isPresent',
  'canonicalHeirs.MATERNAL_GRANDMOTHER.count',
  'canonicalHeirs.MATERNAL_GRANDMOTHER.isPresent',
  'canonicalHeirs.FULL_BROTHER.count',
  'canonicalHeirs.FULL_BROTHER.isPresent',
  'canonicalHeirs.FULL_SISTER.count',
  'canonicalHeirs.FULL_SISTER.isPresent',
  'canonicalHeirs.PATERNAL_BROTHER.count',
  'canonicalHeirs.PATERNAL_BROTHER.isPresent',
  'canonicalHeirs.PATERNAL_SISTER.count',
  'canonicalHeirs.PATERNAL_SISTER.isPresent',
  'canonicalHeirs.MATERNAL_BROTHER.count',
  'canonicalHeirs.MATERNAL_BROTHER.isPresent',
  'canonicalHeirs.MATERNAL_SISTER.count',
  'canonicalHeirs.MATERNAL_SISTER.isPresent',
  'canonicalHeirs.MATERNAL_HALF_SIBLING.count',
  'canonicalHeirs.MATERNAL_HALF_SIBLING.isPresent',
  'canonicalHeirs.FULL_BROTHERS_SON.count',
  'canonicalHeirs.FULL_BROTHERS_SON.isPresent',
  'canonicalHeirs.PATERNAL_BROTHERS_SON.count',
  'canonicalHeirs.PATERNAL_BROTHERS_SON.isPresent',
  'canonicalHeirs.FATHERS_FULL_BROTHER.count',
  'canonicalHeirs.FATHERS_FULL_BROTHER.isPresent',
  'canonicalHeirs.FATHERS_FULL_BROTHERS_SON.count',
  'canonicalHeirs.FATHERS_FULL_BROTHERS_SON.isPresent',
  // Legacy camelCase heir counts (deprecated)
  'heirs.husband.count',
  'heirs.husband.isPresent',
  'heirs.wives.count',
  'heirs.wives.isPresent',
  'heirs.sons.count',
  'heirs.sons.isPresent',
  'heirs.daughters.count',
  'heirs.daughters.isPresent',
  'heirs.father.count',
  'heirs.father.isPresent',
  'heirs.mother.count',
  'heirs.mother.isPresent',
  'heirs.paternalGrandfathers.count',
  'heirs.paternalGrandfathers.isPresent',
  'heirs.paternalGrandmothers.count',
  'heirs.paternalGrandmothers.isPresent',
  'heirs.maternalGrandmothers.count',
  'heirs.maternalGrandmothers.isPresent',
  'heirs.fullBrothers.count',
  'heirs.fullBrothers.isPresent',
  'heirs.fullSisters.count',
  'heirs.fullSisters.isPresent',
  'heirs.paternalHalfBrothers.count',
  'heirs.paternalHalfBrothers.isPresent',
  'heirs.paternalHalfSisters.count',
  'heirs.paternalHalfSisters.isPresent',
  'heirs.maternalHalfSiblings.count',
  'heirs.maternalHalfSiblings.isPresent',
  'heirs.sonsOfFullBrothers.count',
  'heirs.sonsOfFullBrothers.isPresent',
  'heirs.sonsOfPatHalfBrothers.count',
  'heirs.sonsOfPatHalfBrothers.isPresent',
  'heirs.paternalUncles.count',
  'heirs.paternalUncles.isPresent',
  'heirs.sonsOfPatUncles.count',
  'heirs.sonsOfPatUncles.isPresent',
  // Computed
  'computed.hasChildren',
  'computed.hasMaleLineDescendants',
  'computed.hasSiblings',
  'computed.hasSpouse',
  'computed.hasAscendants',
] as const;

export const ZAKAT_CONDITION_PATHS = [
  // Profile
  'profile.madhhab',
  'profile.currencyCode',
  'profile.region',
  // Assets
  'assets.cash.amount',
  'assets.cash.isPresent',
  'assets.gold.amount',
  'assets.gold.isPresent',
  'assets.silver.amount',
  'assets.silver.isPresent',
  'assets.businessInventory.amount',
  'assets.businessInventory.isPresent',
  'assets.investments.amount',
  'assets.investments.isPresent',
  'assets.receivables.amount',
  'assets.receivables.isPresent',
  'assets.agriculture.amount',
  'assets.agriculture.isPresent',
  'assets.agriculture.irrigationMethod',
  'assets.livestock.amount',
  'assets.livestock.isPresent',
  // Liabilities
  'liabilities.totalLiabilities',
  'liabilities.shortTermDebts',
  // Nisab
  'nisab.hawlMet',
  'nisab.goldNisabValueInCurrency',
  'nisab.silverNisabValueInCurrency',
  // Computed
  'computed.totalZakatableWealth',
  'computed.netZakatableWealth',
  'computed.meetsNisabGold',
  'computed.meetsNisabSilver',
  'computed.meetsNisabLower',
] as const;

export type MirathConditionPath = typeof MIRATH_CONDITION_PATHS[number];
export type ZakatConditionPath  = typeof ZAKAT_CONDITION_PATHS[number];
export type AnyConditionPath    = MirathConditionPath | ZakatConditionPath;

export const ALL_CONDITION_PATHS: readonly string[] = [
  ...MIRATH_CONDITION_PATHS,
  ...ZAKAT_CONDITION_PATHS,
];

/** Returns true if the given path is a registered canonical condition path */
export function isValidConditionPath(path: string): boolean {
  return (ALL_CONDITION_PATHS as readonly string[]).includes(path);
}
