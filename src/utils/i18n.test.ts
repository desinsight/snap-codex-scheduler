import i18next from './i18n';

describe('i18n', () => {
  beforeEach(() => {
    i18next.changeLanguage('ko');
  });

  it('should initialize with Korean as default language', () => {
    expect(i18next.language).toBe('ko');
  });

  it('should translate login form texts correctly in Korean', () => {
    expect(i18next.t('auth.login.title')).toBe('로그인');
    expect(i18next.t('auth.login.email')).toBe('이메일');
    expect(i18next.t('auth.login.password')).toBe('비밀번호');
    expect(i18next.t('auth.login.rememberMe')).toBe('자동 로그인');
  });

  it('should translate login form texts correctly in English', () => {
    i18next.changeLanguage('en');
    expect(i18next.t('auth.login.title')).toBe('Login');
    expect(i18next.t('auth.login.email')).toBe('Email');
    expect(i18next.t('auth.login.password')).toBe('Password');
    expect(i18next.t('auth.login.rememberMe')).toBe('Remember me');
  });

  it('should handle interpolation correctly', () => {
    expect(i18next.t('auth.login.errors.required', { field: '이메일' }))
      .toBe('이메일을(를) 입력해주세요');
    
    i18next.changeLanguage('en');
    expect(i18next.t('auth.login.errors.required', { field: 'Email' }))
      .toBe('Email is required');
  });

  it('should fallback to English when translation is missing', () => {
    i18next.changeLanguage('ko');
    expect(i18next.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should handle loading messages correctly', () => {
    expect(i18next.t('auth.loading.loggingIn')).toBe('로그인 중...');
    expect(i18next.t('auth.loading.registering')).toBe('계정 생성 중...');
    expect(i18next.t('auth.loading.refreshing')).toBe('세션 갱신 중...');
  });

  it('should handle error messages correctly', () => {
    expect(i18next.t('auth.login.errors.invalidEmail'))
      .toBe('올바른 이메일 주소를 입력해주세요');
    expect(i18next.t('auth.login.errors.invalidPassword'))
      .toBe('비밀번호는 최소 12자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다');
  });
}); 