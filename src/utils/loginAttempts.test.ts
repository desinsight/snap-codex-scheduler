import {
  isAccountLocked,
  recordLoginAttempt,
  clearLoginAttempts,
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION
} from './loginAttempts';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Login Attempts', () => {
  const email = 'test@example.com';
  const email1 = 'test1@example.com';
  const email2 = 'test2@example.com';

  beforeEach(() => {
    clearLoginAttempts(email);
    clearLoginAttempts(email1);
    clearLoginAttempts(email2);
  });

  it('should record login attempts', () => {
    recordLoginAttempt(email);
    expect(isAccountLocked(email)).toBe(false);
  });

  it('should not lock account for successful login', () => {
    recordLoginAttempt(email);
    expect(isAccountLocked(email)).toBe(false);
  });

  it('should not lock account for less than max attempts', () => {
    recordLoginAttempt(email);
    recordLoginAttempt(email);
    expect(isAccountLocked(email)).toBe(false);
  });

  it('should lock account after max failed attempts', () => {
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      recordLoginAttempt(email);
    }
    expect(isAccountLocked(email)).toBe(true);
  });

  it('should unlock account after lock duration', () => {
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      recordLoginAttempt(email);
    }
    expect(isAccountLocked(email)).toBe(true);

    // Fast forward time
    jest.advanceTimersByTime(LOCK_DURATION + 1000);
    expect(isAccountLocked(email)).toBe(false);
  });

  it('should clear login attempts', () => {
    recordLoginAttempt(email);
    recordLoginAttempt(email);
    clearLoginAttempts(email);
    expect(isAccountLocked(email)).toBe(false);
  });

  it('should handle multiple accounts independently', () => {
    recordLoginAttempt(email1);
    recordLoginAttempt(email2);
    expect(isAccountLocked(email1)).toBe(false);
    expect(isAccountLocked(email2)).toBe(false);
  });
}); 