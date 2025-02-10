import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../public/locales/ENGLISH.json';
import punTranslation from '../public/locales/PUNJABI.json';
import teluTranslation from '../public/locales/TELUGU.json';
import tamiTranslation from '../public/locales/TAMIL.json';
import kannTranslation from '../public/locales/KANNADA.json';
import odiaTranslation from '../public/locales/ODIA.json';
import hiTranslation from '../public/locales/HINDI.json';


const resources = {
  ENGLISH: { translation: enTranslation },
  PUNJABI: { translation: punTranslation },
  TELUGU: { translation: teluTranslation },
  TAMIL: { translation: tamiTranslation },
  KANNADA: { translation: kannTranslation },
  ODIA: { translation: odiaTranslation },
  HINDI: { translation: hiTranslation },
};

const language = localStorage.getItem('language');
let initLanguage = 'ENGLISH';
if(language && language != null){
  initLanguage = language;
}

i18n.use(initReactI18next).init({
  resources,
  lng: initLanguage,
  fallbackLng: 'ENGLISH',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
