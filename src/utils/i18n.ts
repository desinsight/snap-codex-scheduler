import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: {
    translation: {
      auth: {
        login: {
          title: '로그인',
          email: '이메일',
          password: '비밀번호',
          rememberMe: '자동 로그인',
          submit: '로그인',
          forgotPassword: '비밀번호를 잊으셨나요?',
          noAccount: '계정이 없으신가요?',
          signUp: '회원가입',
          errors: {
            required: '{{field}}을(를) 입력해주세요',
            invalidEmail: '유효하지 않은 이메일 형식입니다',
            invalidPassword: '비밀번호는 최소 12자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다',
            accountLocked: '계정이 잠겼습니다. 잠시 후 다시 시도해주세요',
            invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
            tooManyAttempts: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요',
          },
        },
        register: {
          title: '회원가입',
          name: '이름',
          email: '이메일',
          password: '비밀번호',
          confirmPassword: '비밀번호 확인',
          submit: '회원가입',
          haveAccount: '이미 계정이 있으신가요?',
          signIn: '로그인',
          errors: {
            passwordMismatch: '비밀번호가 일치하지 않습니다',
            emailExists: '이미 존재하는 이메일입니다',
            weakPassword: '비밀번호가 너무 약합니다',
          },
        },
        loading: {
          loggingIn: '로그인 중...',
          registering: '계정 생성 중...',
          refreshing: '세션 갱신 중...',
        },
      },
    },
  },
  en: {
    translation: {
      auth: {
        login: {
          title: 'Login',
          email: 'Email',
          password: 'Password',
          rememberMe: 'Remember me',
          submit: 'Sign in',
          forgotPassword: 'Forgot password?',
          noAccount: "Don't have an account?",
          signUp: 'Sign up',
          errors: {
            required: '{{field}} is required',
            invalidEmail: 'Invalid email format',
            invalidPassword: 'Password must be at least 12 characters long and include uppercase, lowercase, number, and special character',
            accountLocked: 'Account is locked. Please try again later',
            invalidCredentials: 'Invalid email or password',
            tooManyAttempts: 'Too many login attempts. Please try again later',
          },
        },
        register: {
          title: 'Register',
          name: 'Name',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          submit: 'Sign up',
          haveAccount: 'Already have an account?',
          signIn: 'Sign in',
          errors: {
            nameRequired: 'Name is required',
            emailRequired: 'Email is required',
            invalidEmail: 'Invalid email format',
            passwordRequired: 'Password is required',
            passwordLength: 'Password must be at least 12 characters long',
            passwordUppercase: 'Password must include an uppercase letter',
            passwordLowercase: 'Password must include a lowercase letter',
            passwordNumber: 'Password must include a number',
            passwordSpecial: 'Password must include a special character',
            passwordMismatch: 'Passwords do not match',
            emailExists: 'Email is already in use',
          },
        },
        loading: {
          loggingIn: 'Logging in...',
          registering: 'Creating account...',
          refreshing: 'Refreshing session...',
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 