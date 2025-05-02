import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { AuthResponse } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const EXPIRY_KEY = 'token_expiry';
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
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + authResponse.expiresIn * 1000));
};

// 토큰 가져오기
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 리프레시 토큰 가져오기
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// 토큰 만료 시간 가져오기
export const getTokenExpiry = (): number | null => {
  const expiry = localStorage.getItem(EXPIRY_KEY);
  return expiry ? parseInt(expiry, 10) : null;
};

// 토큰 유효성 검사
export const isTokenValid = (): boolean => {
  const expiry = getTokenExpiry();
  return expiry ? Date.now() < expiry : false;
};

// 토큰 갱신
export const updateToken = (newToken: string, newExpiresIn: number): void => {
  localStorage.setItem(TOKEN_KEY, newToken);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + newExpiresIn * 1000));
};

// 모든 토큰 제거
export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

// 토큰 만료까지 남은 시간 (밀리초)
export const getTimeUntilExpiry = (): number | null => {
  const expiry = getTokenExpiry();
  if (!expiry) return null;
  const timeUntilExpiry = expiry - Date.now();
  return timeUntilExpiry > 0 ? timeUntilExpiry : 0;
};
