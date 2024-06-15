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

const language = localStorage.getItem('language');
let initLanguage = 'en';
if(language && language != null){
  initLanguage = language;
}

i18n.use(initReactI18next).init({
  resources,
  lng: initLanguage,
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
