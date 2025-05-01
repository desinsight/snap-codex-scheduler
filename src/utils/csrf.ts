import { randomBytes } from 'crypto';

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const generateCsrfToken = (): string => {
  return randomBytes(32).toString('hex');
};

export const saveCsrfToken = (token: string): void => {
  const expiry = Date.now() + CSRF_TOKEN_EXPIRY;
  localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify({ token, expiry }));
};

export const getCsrfToken = (): string | null => {
  const stored = localStorage.getItem(CSRF_TOKEN_KEY);
  if (!stored) return null;

  try {
    const { token, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
      clearCsrfToken();
      return null;
    }
    return token;
  } catch {
    clearCsrfToken();
    return null;
  }
};

export const clearCsrfToken = (): void => {
  localStorage.removeItem(CSRF_TOKEN_KEY);
};

export const validateCsrfToken = (token: string): boolean => {
  const storedToken = getCsrfToken();
  return storedToken === token;
}; 