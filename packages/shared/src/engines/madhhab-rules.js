"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jafariRules = exports.hanbaliRules = exports.shafiiRules = exports.malikiRules = exports.hanafiRules = void 0;
exports.getMadhhabRules = getMadhhabRules;
/**
 * Hanafi Rules (Baseline)
 * - Radd: Spouse does NOT get Radd
 * - Grandfather + Brothers: Grandfather gets the better of: (a) 1/6, (b) share with brothers, (c) entire residue if that's larger (Akdariyya)
 * - Al-Umariyyatan: Mother gets 1/3 of remainder (after spouse) when: Spouse + Father + Mother only
 */
exports.hanafiRules = {
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
exports.malikiRules = {
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
exports.shafiiRules = {
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
exports.hanbaliRules = {
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
exports.jafariRules = {
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
function getMadhhabRules(madhhab) {
    switch (madhhab.toUpperCase()) {
        case 'MALIKI': return exports.malikiRules;
        case 'SHAFII': return exports.shafiiRules;
        case 'HANBALI': return exports.hanbaliRules;
        case 'JAFARI': return exports.jafariRules;
        case 'HANAFI':
        default:
            return exports.hanafiRules;
    }
}
