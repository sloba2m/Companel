import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en/translation.json';
import seTranslation from './locales/se/translation.json';

const resources = {
  en: { translation: enTranslation },
  se: { translation: seTranslation },
};

// Try to get the language from localStorage or fallback to 'en'
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en', // fallback ako jezik nije pronađen u resources
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
