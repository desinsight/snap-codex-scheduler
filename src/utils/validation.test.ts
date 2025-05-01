import { validateEmail, validatePassword, validateName } from './validation';

describe('validateEmail', () => {
  it('올바른 이메일 주소를 검증한다', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.kr')).toBe(true);
    expect(validateEmail('user+tag@domain.com')).toBe(true);
  });

  it('잘못된 이메일 주소를 거부한다', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('test')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('test@domain')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('올바른 비밀번호를 검증한다', () => {
    expect(validatePassword('Test1234!@#$')).toBe(true);
    expect(validatePassword('SecurePass123!')).toBe(true);
    expect(validatePassword('Complex1Password!')).toBe(true);
  });

  it('잘못된 비밀번호를 거부한다', () => {
    // 최소 12자 미만
    expect(validatePassword('Test123!')).toBe(false);
    // 대문자 없음
    expect(validatePassword('test1234!@#$')).toBe(false);
    // 소문자 없음
    expect(validatePassword('TEST1234!@#$')).toBe(false);
    // 숫자 없음
    expect(validatePassword('TestPassword!')).toBe(false);
    // 특수문자 없음
    expect(validatePassword('TestPassword123')).toBe(false);
  });
});

describe('validateName', () => {
  it('올바른 이름을 검증한다', () => {
    expect(validateName('홍길동')).toBe(true);
    expect(validateName('John Doe')).toBe(true);
    expect(validateName('김철수123')).toBe(true);
  });

  it('잘못된 이름을 거부한다', () => {
    // 최소 2자 미만
    expect(validateName('홍')).toBe(false);
    // 특수문자 포함
    expect(validateName('홍길동!')).toBe(false);
    expect(validateName('John@Doe')).toBe(false);
    // 빈 문자열
    expect(validateName('')).toBe(false);
  });
}); 