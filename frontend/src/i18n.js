import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import it from './locales/it.json';
import mg from './locales/mg.json';

const languages = ['fr', 'en', 'it', 'mg'];
const savedLanguage = localStorage.getItem('ong-language');
const language = languages.includes(savedLanguage) ? savedLanguage : 'fr';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    it: { translation: it },
    mg: { translation: mg }
  },
  lng: language,
  fallbackLng: 'fr',
  supportedLngs: languages,
  interpolation: { escapeValue: false }
});

document.documentElement.lang = language;

i18n.on('languageChanged', lng => {
  localStorage.setItem('ong-language', lng);
  document.documentElement.lang = lng;
});

export default i18n;