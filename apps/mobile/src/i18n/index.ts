import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';
import { translations } from './translations';

const resources = {
  en: { translation: { ...en, ...translations.en } },
  ar: { translation: { ...ar, ...translations.ar } },
  ha: { translation: { ...translations.ha } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'ha'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
