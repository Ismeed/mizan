import { HeirsInput, Madhhab } from '../types/inheritance.types';
import { Frac } from '../utils/fraction.utils';

// Dummy context types for the example architecture mentioned in the prompt
export type EstateContext = any;
export type GrandfatherBrothersResult = any;

/**
 * Defines a plugin system where each Madhhab can override specific rules from the base Hanafi engine.
 */
export interface MadhhabRuleSet {
  madhhabName: Madhhab;

  // Override functions — if undefined, use Hanafi default
  getMotherShare?: (heirs: HeirsInput, estateContext?: EstateContext) => Frac | null;
  getGrandfatherAndBrothersRule?: (heirs: HeirsInput) => GrandfatherBrothersResult;
  
  /**
   * Defines whether Radd (return of surplus) is allowed in this Madhhab.
   * Shafii and Hanbali do not give Radd to anyone (surplus goes to Bayt al-Mal).
   */
  allowRadd?: boolean;
  
  /**
   * Defines whether the spouse is eligible for Radd.
   * In Hanafi, spouses do NOT get Radd.
   * In Maliki, spouses CAN get Radd.
   */
  raddIncludesSpouse?: boolean;

  /**
   * Defines whether Maternal Grandfather blocks Maternal Grandmother.
   * Maliki: Maternal grandfather does NOT block maternal grandmother.
   */
  maternalGrandfatherBlocksMaternalGrandmother?: boolean;
  
  /**
   * Defines whether full siblings block grandparents.
   * Jafari: Full siblings do NOT block grandparents (opposite to Sunni schools).
   */
  fullSiblingsBlockGrandparents?: boolean;

  /**
   * Defines whether the grandfather blocks maternal (uterine) siblings.
   * Hanbali: Uterine siblings are blocked by grandfather.
   */
  grandfatherBlocksMaternalSiblings?: boolean;

  /**
   * Defines whether the spouse is restricted from inheriting real estate.
   * Jafari: Spouse does NOT inherit land/real estate (only the value of the land).
   */
  spouseInheritsLand?: boolean;

  /**
   * Defines whether the Jafari class-based system applies.
   * Jafari has 3 classes of priority: Class 1, Class 2, Class 3.
   */
  applyJafariSystem?: boolean;
}

/**
 * Hanafi Rules (Baseline)
 * - Radd: Spouse does NOT get Radd
 * - Grandfather + Brothers: Grandfather gets the better of: (a) 1/6, (b) share with brothers, (c) entire residue if that's larger (Akdariyya)
 * - Al-Umariyyatan: Mother gets 1/3 of remainder (after spouse) when: Spouse + Father + Mother only
 */
export const hanafiRules: MadhhabRuleSet = {
  madhhabName: 'HANAFI',
  allowRadd: true,
  raddIncludesSpouse: false,
  maternalGrandfatherBlocksMaternalGrandmother: true,
  fullSiblingsBlockGrandparents: true,
  grandfatherBlocksMaternalSiblings: true,
  spouseInheritsLand: true,
  applyJafariSystem: false,
};

/**
 * Maliki Rules
 * - Radd: Spouse CAN get Radd (differs from Hanafi)
 * - Blocking: Maternal grandfather does NOT block maternal grandmother
 * - Grandfather with brothers: Maliki generally gives grandfather the same as a brother (muqasama) or 1/6 whichever is more, but without completely blocking brothers unlike some positions.
 */
export const malikiRules: MadhhabRuleSet = {
  madhhabName: 'MALIKI',
  allowRadd: true,
  raddIncludesSpouse: true, // Key difference: Spouse can get Radd
  maternalGrandfatherBlocksMaternalGrandmother: false, // Key difference
  fullSiblingsBlockGrandparents: true,
  grandfatherBlocksMaternalSiblings: true,
  spouseInheritsLand: true,
  applyJafariSystem: false,
};

/**
 * Shafi'i Rules
 * - Radd: Does NOT give Radd to anyone (if surplus remains, it goes to Bayt al-Mal / public treasury)
 * - Grandfather: Like Hanafi but with some differences in Akdariyya
 * - Al-Umariyyatan: Also recognises this rule (same as Hanafi)
 */
export const shafiiRules: MadhhabRuleSet = {
  madhhabName: 'SHAFII',
  allowRadd: false, // Key difference: No Radd to anyone
  raddIncludesSpouse: false,
  maternalGrandfatherBlocksMaternalGrandmother: true,
  fullSiblingsBlockGrandparents: true,
  grandfatherBlocksMaternalSiblings: true,
  spouseInheritsLand: true,
  applyJafariSystem: false,
};

/**
 * Hanbali Rules
 * - Radd: Similar to Shafi'i (no Radd to anyone)
 * - Grandfather + Brothers: Follows Ibn Qudama's position (blocks brothers completely)
 * - Uterine (maternal) siblings are blocked by grandfather
 */
export const hanbaliRules: MadhhabRuleSet = {
  madhhabName: 'HANBALI',
  allowRadd: false, // Key difference: No Radd to anyone
  raddIncludesSpouse: false,
  maternalGrandfatherBlocksMaternalGrandmother: true,
  fullSiblingsBlockGrandparents: true,
  grandfatherBlocksMaternalSiblings: true, // Key rule explicitly highlighted
  spouseInheritsLand: true,
  applyJafariSystem: false,
};

/**
 * Ja'fari (Shia Ithna Ashari) Rules
 * - Spouse does NOT inherit land/real estate (only value of land)
 * - Full siblings' presence does NOT block grandparents (opposite to Sunni schools)
 * - Maternal relatives inherit before distant paternal relatives
 * - Three classes/orders of priority: Class 1, Class 2, Class 3
 * - Son of son does NOT inherit alongside son
 */
export const jafariRules: MadhhabRuleSet = {
  madhhabName: 'JAFARI',
  allowRadd: true,
  raddIncludesSpouse: false,
  maternalGrandfatherBlocksMaternalGrandmother: false,
  fullSiblingsBlockGrandparents: false, // Key difference: siblings do NOT block grandparents
  grandfatherBlocksMaternalSiblings: false,
  spouseInheritsLand: false, // Key difference: Spouse does NOT inherit land
  applyJafariSystem: true, // Indicates massive structural divergence (Class 1, 2, 3)
};

/**
 * Factory function to retrieve the ruleset for a given Madhhab.
 * @param madhhab The requested Madhhab
 * @returns The MadhhabRuleSet for the provided madhhab
 */
export function getMadhhabRules(madhhab: string): MadhhabRuleSet {
  switch (madhhab.toUpperCase()) {
    case 'MALIKI': return malikiRules;
    case 'SHAFII': return shafiiRules;
    case 'HANBALI': return hanbaliRules;
    case 'JAFARI': return jafariRules;
    case 'HANAFI':
    default:
      return hanafiRules;
  }
}
