import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Snap Codex',
      scheduler: 'Scheduler',
      api: 'API',
    },
  },
  ko: {
    translation: {
      welcome: '스냅 코덱스에 오신 것을 환영합니다',
      scheduler: '스케줄러',
      api: 'API',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ko',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
