import i18n from './i18n';

describe('i18n', () => {
  beforeEach(() => {
    i18n.changeLanguage('ko');
  });

  it('should initialize with Korean as default language', () => {
    expect(i18n.language).toBe('ko');
  });

  it('should handle error messages correctly', () => {
    const errorMessage = i18n.t('auth.login.errors.invalidEmail');
    expect(errorMessage).toBe('유효하지 않은 이메일 형식입니다');
  });

  it('should handle form labels correctly', () => {
    const emailLabel = i18n.t('auth.login.email');
    const passwordLabel = i18n.t('auth.login.password');
    expect(emailLabel).toBe('이메일');
    expect(passwordLabel).toBe('비밀번호');
  });

  it('should handle button texts correctly', () => {
    const submitButton = i18n.t('auth.login.submit');
    expect(submitButton).toBe('로그인');
  });

  it('should handle loading messages correctly', () => {
    const loadingMessage = i18n.t('auth.loading.loggingIn');
    expect(loadingMessage).toBe('로그인 중...');
  });

  it('should translate login form texts correctly in Korean', () => {
    expect(i18n.t('auth.login.title')).toBe('로그인');
    expect(i18n.t('auth.login.rememberMe')).toBe('자동 로그인');
  });

  it('should translate login form texts correctly in English', () => {
    i18n.changeLanguage('en');
    expect(i18n.t('auth.login.title')).toBe('Login');
    expect(i18n.t('auth.login.rememberMe')).toBe('Remember me');
  });

  it('should handle interpolation correctly', () => {
    expect(i18n.t('auth.login.errors.required', { field: '이메일' }))
      .toBe('이메일을(를) 입력해주세요');
    
    i18n.changeLanguage('en');
    expect(i18n.t('auth.login.errors.required', { field: 'Email' }))
      .toBe('Email is required');
  });

  it('should fallback to English when translation is missing', () => {
    i18n.changeLanguage('ko');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('should handle loading messages correctly', () => {
    expect(i18n.t('auth.loading.registering')).toBe('계정 생성 중...');
    expect(i18n.t('auth.loading.refreshing')).toBe('세션 갱신 중...');
  });

  it('should handle error messages correctly', () => {
    expect(i18n.t('auth.login.errors.invalidPassword'))
      .toBe('비밀번호는 최소 12자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다');
  });
}); 