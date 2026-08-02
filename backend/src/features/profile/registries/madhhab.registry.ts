import { MadhhabCode } from '@mizan/shared';

export interface MadhhabDefinition {
  code: MadhhabCode;
  name: {
    en: string;
    ha: string;
    ar: string;
    fr?: string;
    sw?: string;
  };
  description: {
    en: string;
    ha: string;
    ar: string;
  };
  status: 'ACTIVE' | 'INACTIVE';
  supportedModules: ('MIRATH' | 'ZAKAT')[];
}

export const MADHHAB_REGISTRY: Record<MadhhabCode, MadhhabDefinition> = {
  HANAFI: {
    code: 'HANAFI',
    name: {
      en: 'Hanafi School',
      ha: 'Makaranta Hanafiya',
      ar: 'المذهب الحنفي',
    },
    description: {
      en: 'School of Imam Abu Hanifa, widely followed in South Asia, Turkey, and Central Asia.',
      ha: 'Makarantar Imam Abu Hanifa, da aka fi bi a Kudancin Asiya, Turkiyya, da Asiya ta Tsakiya.',
      ar: 'مذهب الإمام أبي حنيفة النعمان.',
    },
    status: 'ACTIVE',
    supportedModules: ['MIRATH', 'ZAKAT'],
  },
  MALIKI: {
    code: 'MALIKI',
    name: {
      en: 'Maliki School',
      ha: 'Makaranta Malikiyya',
      ar: 'المذهب المالكي',
    },
    description: {
      en: 'School of Imam Malik ibn Anas, widely followed in North & West Africa and the Gulf.',
      ha: 'Makarantar Imam Malik ibn Anas, da aka fi bi a Arewaci da Yammacin Afirka.',
      ar: 'مذهب الإمام مالك بن أنس مذهب أهل المدينة.',
    },
    status: 'ACTIVE',
    supportedModules: ['MIRATH', 'ZAKAT'],
  },
  SHAFII: {
    code: 'SHAFII',
    name: {
      en: 'Shafi\'i School',
      ha: 'Makaranta Shafi\'iyya',
      ar: 'المذهب الشافعي',
    },
    description: {
      en: 'School of Imam Al-Shafi\'i, widely followed in East Africa, Southeast Asia, and Yemen.',
      ha: 'Makarantar Imam Al-Shafi\'i, da aka fi bi a Gabashin Afirka da Kudu maso Gabashin Asiya.',
      ar: 'مذهب الإمام محمد بن إدريس الشافعي.',
    },
    status: 'ACTIVE',
    supportedModules: ['MIRATH', 'ZAKAT'],
  },
  HANBALI: {
    code: 'HANBALI',
    name: {
      en: 'Hanbali School',
      ha: 'Makaranta Hanbaliyya',
      ar: 'المذهب الحنبلي',
    },
    description: {
      en: 'School of Imam Ahmad ibn Hanbal, widely followed in the Arabian Peninsula.',
      ha: 'Makarantar Imam Ahmad ibn Hanbal, da aka fi bi a Tsibirin Larabawa.',
      ar: 'مذهب الإمام أحمد بن حنبل.',
    },
    status: 'ACTIVE',
    supportedModules: ['MIRATH', 'ZAKAT'],
  },
  JAFARI: {
    code: 'JAFARI',
    name: {
      en: 'Ja\'fari School',
      ha: 'Makaranta Ja\'fariyya',
      ar: 'المذهب الجعفري',
    },
    description: {
      en: 'School of Imam Ja\'far al-Sadiq.',
      ha: 'Makarantar Imam Ja\'far al-Sadiq.',
      ar: 'مذهب الإمام جعفر الصادق.',
    },
    status: 'ACTIVE',
    supportedModules: ['MIRATH', 'ZAKAT'],
  },
};

export class MadhhabRegistryService {
  static get(code: string): MadhhabDefinition | undefined {
    const canonical = (code || '').toUpperCase() as MadhhabCode;
    return MADHHAB_REGISTRY[canonical];
  }

  static isSupported(code: string): boolean {
    const def = this.get(code);
    return def !== undefined && def.status === 'ACTIVE';
  }

  static getAll(): MadhhabDefinition[] {
    return Object.values(MADHHAB_REGISTRY);
  }
}
