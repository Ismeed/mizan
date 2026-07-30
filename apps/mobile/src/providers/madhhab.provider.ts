import { getMadhhabRules, MadhhabRuleSet, Madhhab } from '@mizan/shared';
import { useSettingsStore, MadhhabCode } from '../stores/settings.store';

/**
 * Provider architecture for Madhhab rules.
 * Acts as an abstraction layer between calculation engines / UI and the Shariah rule definitions.
 * When the structured Knowledge Base is expanded in future releases, the engines
 * consume rules exclusively via this provider without UI modification.
 */
export class MadhhabProvider {
  /**
   * Returns the currently active Madhhab code from global user settings.
   */
  static getActiveMadhhabCode(): MadhhabCode {
    const raw = useSettingsStore.getState().madhhab;
    return (raw ? raw.toUpperCase() : 'MALIKI') as MadhhabCode;
  }

  /**
   * Returns the canonical Madhhab enum type for Mirath / Zakat engines.
   */
  static getActiveMadhhab(): Madhhab {
    const code = this.getActiveMadhhabCode();
    switch (code) {
      case 'MALIKI':  return 'MALIKI';
      case 'HANAFI':  return 'HANAFI';
      case 'SHAFII':  return 'SHAFII';
      case 'HANBALI': return 'HANBALI';
      case 'JAFARI':  return 'JAFARI';
      default:        return 'MALIKI';
    }
  }

  /**
   * Returns the complete rule set for the active or specified Madhhab.
   */
  static getRuleSet(madhhabOverride?: string): MadhhabRuleSet {
    const madhhab = madhhabOverride || this.getActiveMadhhab();
    return getMadhhabRules(madhhab);
  }

  /**
   * Formats the Madhhab code for human-readable UI display.
   */
  static getDisplayName(madhhabCode?: string): string {
    const code = (madhhabCode || this.getActiveMadhhabCode()).toUpperCase();
    switch (code) {
      case 'MALIKI':  return 'Maliki';
      case 'HANAFI':  return 'Hanafi';
      case 'SHAFII':  return "Shafi'i";
      case 'HANBALI': return 'Hanbali';
      case 'JAFARI':  return "Ja'fari";
      default:        return 'Maliki';
    }
  }

  /**
   * Short description of each Madhhab for selection modals.
   */
  static getDescription(madhhabCode: MadhhabCode): string {
    switch (madhhabCode) {
      case 'MALIKI':  return 'Prevalent in North & West Africa. Default school in MIZAN.';
      case 'HANAFI':  return 'Prevalent in South Asia, Turkey, & Levant. Prefers Silver Nisab.';
      case 'SHAFII':  return "Prevalent in Southeast Asia, East Africa, & Yemen. Strict Hawl rules.";
      case 'HANBALI': return 'Prevalent in Saudi Arabia & Gulf. Distinct grandfather blocking.';
      case 'JAFARI':  return "Shia Ithna Ashari jurisprudence. Class-based inheritance rules.";
      default:        return '';
    }
  }
}
