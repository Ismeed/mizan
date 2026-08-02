import { TextDirection } from '@mizan/shared';

export interface LanguageDefinition {
  tag: string;
  name: {
    en: string;
    ha: string;
    ar: string;
    native: string;
  };
  locale: string;
  direction: TextDirection;
  status: 'ACTIVE' | 'INACTIVE';
}

export const LANGUAGE_REGISTRY: Record<string, LanguageDefinition> = {
  en: {
    tag: 'en',
    name: {
      en: 'English',
      ha: 'Turanci',
      ar: ' الإنجليزية',
      native: 'English',
    },
    locale: 'en-US',
    direction: 'LTR',
    status: 'ACTIVE',
  },
  ha: {
    tag: 'ha',
    name: {
      en: 'Hausa',
      ha: 'Hausa',
      ar: 'الهوسا',
      native: 'Hausa',
    },
    locale: 'ha-NG',
    direction: 'LTR',
    status: 'ACTIVE',
  },
  ar: {
    tag: 'ar',
    name: {
      en: 'Arabic',
      ha: 'Larabci',
      ar: 'العربية',
      native: 'العربية',
    },
    locale: 'ar-SA',
    direction: 'RTL',
    status: 'ACTIVE',
  },
  fr: {
    tag: 'fr',
    name: {
      en: 'French',
      ha: 'Faransanci',
      ar: 'الفرنسية',
      native: 'Français',
    },
    locale: 'fr-FR',
    direction: 'LTR',
    status: 'ACTIVE',
  },
  sw: {
    tag: 'sw',
    name: {
      en: 'Swahili',
      ha: 'Harshen Swahili',
      ar: 'السواحلية',
      native: 'Kiswahili',
    },
    locale: 'sw-KE',
    direction: 'LTR',
    status: 'ACTIVE',
  },
};

export class LanguageRegistryService {
  static get(tag: string): LanguageDefinition | undefined {
    const canonical = (tag || 'en').toLowerCase().split('-')[0];
    return LANGUAGE_REGISTRY[canonical];
  }

  static isSupported(tag: string): boolean {
    const def = this.get(tag);
    return def !== undefined && def.status === 'ACTIVE';
  }

  static getAll(): LanguageDefinition[] {
    return Object.values(LANGUAGE_REGISTRY);
  }

  static getDirection(tag: string): TextDirection {
    const def = this.get(tag);
    return def ? def.direction : 'LTR';
  }
}
