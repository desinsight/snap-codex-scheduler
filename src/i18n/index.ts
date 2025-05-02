import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      errors: {
        unknown: '알 수 없는 오류가 발생했습니다.',
        networkError: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        password: '비밀번호는 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.',
        email: '올바른 이메일 형식을 입력해주세요.',
        unauthorized: '로그인이 필요합니다.',
        forbidden: '권한이 없습니다.',
        notFound: '요청하신 페이지를 찾을 수 없습니다.',
        conflict: '이미 존재하는 데이터입니다.',
        tooManyRequests: '너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해주세요.',
        serverError: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 