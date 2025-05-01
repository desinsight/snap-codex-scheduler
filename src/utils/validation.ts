/**
 * 이메일 주소의 유효성을 검사합니다.
 * @param email 검사할 이메일 주소
 * @returns 이메일이 유효하면 true, 그렇지 않으면 false
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * 비밀번호의 유효성을 검사합니다.
 * @param password 검사할 비밀번호
 * @returns 비밀번호가 유효하면 true, 그렇지 않으면 false
 */
export const validatePassword = (password: string): boolean => {
  // 최소 12자 이상
  if (password.length < 12) return false;

  // 대문자 포함
  if (!/[A-Z]/.test(password)) return false;

  // 소문자 포함
  if (!/[a-z]/.test(password)) return false;

  // 숫자 포함
  if (!/[0-9]/.test(password)) return false;

  // 특수문자 포함
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
};

/**
 * 이름의 유효성을 검사합니다.
 * @param name 검사할 이름
 * @returns 이름이 유효하면 true, 그렇지 않으면 false
 */
export const validateName = (name: string): boolean => {
  // 최소 2자 이상
  if (name.length < 2) return false;

  // 한글, 영문, 숫자만 허용
  const nameRegex = /^[가-힣a-zA-Z0-9\s]+$/;
  return nameRegex.test(name);
};
