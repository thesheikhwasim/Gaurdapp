import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../public/locales/en.json';
import esTranslation from '../public/locales/es.json';
import hiTranslation from '../public/locales/hi.json';


const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  hi: { translation: hiTranslation },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
