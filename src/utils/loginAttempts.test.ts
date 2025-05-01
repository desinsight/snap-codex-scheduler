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

describe('Login Attempts Management', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('recordLoginAttempt', () => {
    it('should record successful login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, true);
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('0');
    });

    it('should record failed login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('1');
    });

    it('should increment failed login attempts', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('3');
    });
  });

  describe('isAccountLocked', () => {
    it('should return false for account with no login attempts', () => {
      const email = 'test@example.com';
      expect(isAccountLocked(email)).toBe(false);
    });

    it('should return false for account with few failed attempts', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      expect(isAccountLocked(email)).toBe(false);
    });

    it('should return true for account with max failed attempts', () => {
      const email = 'test@example.com';
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
        recordLoginAttempt(email, false);
      }
      expect(isAccountLocked(email)).toBe(true);
    });

    it('should unlock account after lock duration', () => {
      const email = 'test@example.com';
      
      // Record max failed attempts
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
        recordLoginAttempt(email, false);
      }
      
      // Move time forward past lock duration
      jest.advanceTimersByTime(LOCK_DURATION + 1000);
      
      expect(isAccountLocked(email)).toBe(false);
    });
  });

  describe('clearLoginAttempts', () => {
    it('should clear all login attempts for an account', () => {
      const email = 'test@example.com';
      
      // Record some failed attempts
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      
      clearLoginAttempts(email);
      
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBeNull();
      expect(localStorageMock.getItem(`lockTime_${email}`)).toBeNull();
    });

    it('should not affect other accounts', () => {
      const email1 = 'test1@example.com';
      const email2 = 'test2@example.com';
      
      recordLoginAttempt(email1, false);
      recordLoginAttempt(email2, false);
      
      clearLoginAttempts(email1);
      
      expect(localStorageMock.getItem(`loginAttempts_${email1}`)).toBeNull();
      expect(localStorageMock.getItem(`loginAttempts_${email2}`)).toBe('1');
    });
  });
}); 