<<<<<<< HEAD
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
=======
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
            tooManyAttempts: 'Too many login attempts. Please try again later',
=======
            tooManyAttempts: 'Too many failed attempts. Please try again later',
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
=======
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
            invalidCredentials: '잘못된 이메일 또는 비밀번호입니다',
            accountLocked: '계정이 일시적으로 잠겼습니다. {{time}}분 후에 다시 시도해주세요',
            invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
            tooManyAttempts: '로그인 시도 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요',
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
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko', // 기본 언어
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

<<<<<<< HEAD
export default i18n; 
=======
export default i18next; 
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
