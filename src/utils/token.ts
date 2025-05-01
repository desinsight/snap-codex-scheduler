import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { AuthResponse } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const ENCRYPTION_KEY = process.env.REACT_APP_TOKEN_ENCRYPTION_KEY || 'default-key-32-bytes-long!';
const IV_LENGTH = 16;

const encrypt = (text: string): string => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// 토큰 저장
export const saveTokens = (authResponse: AuthResponse): void => {
  const { token, refreshToken, expiresIn } = authResponse;

  const encryptedToken = encrypt(token);
  const encryptedRefreshToken = encrypt(refreshToken);

  // 토큰 만료 시간 계산 (현재 시간 + expiresIn(초))
  const expiryTime = Date.now() + expiresIn * 1000;

  localStorage.setItem(TOKEN_KEY, encryptedToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// 토큰 가져오기
export const getToken = (): string | null => {
  const encryptedToken = localStorage.getItem(TOKEN_KEY);
  if (!encryptedToken) return null;
  try {
    return decrypt(encryptedToken);
  } catch {
    clearTokens();
    return null;
  }
};

// 리프레시 토큰 가져오기
export const getRefreshToken = (): string | null => {
  const encryptedToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!encryptedToken) return null;
  try {
    return decrypt(encryptedToken);
  } catch {
    clearTokens();
    return null;
  }
};

// 토큰 만료 시간 가져오기
export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

// 토큰 유효성 검사
export const isTokenValid = (): boolean => {
  const expiry = getTokenExpiry();
  return expiry ? Date.now() < expiry : false;
};

// 토큰 갱신
export const updateToken = (newToken: string, newExpiresIn: number): void => {
  const encryptedToken = encrypt(newToken);
  const expiryTime = Date.now() + newExpiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, encryptedToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// 모든 토큰 제거
export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// 토큰 만료까지 남은 시간 (밀리초)
export const getTimeUntilExpiry = (): number | null => {
  const expiry = getTokenExpiry();
  if (!expiry) return null;
  const timeUntilExpiry = expiry - Date.now();
  return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
};
