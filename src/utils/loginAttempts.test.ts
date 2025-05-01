import {
  isAccountLocked,
  recordLoginAttempt,
  clearLoginAttempts,
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION
} from './loginAttempts';

describe('Login Attempts Management', () => {
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Storage.prototype.getItem = jest.fn((key) => localStorageMock[key] || null);
    Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value.toString();
    });
    Storage.prototype.removeItem = jest.fn((key) => {
      delete localStorageMock[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recordLoginAttempt', () => {
    it('should record successful login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, true);
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('0');
    });

    it('should record failed login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('1');
    });

    it('should increment failed login attempts', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('3');
    });
  });

  describe('isAccountLocked', () => {
    it('should return false for account with no attempts', () => {
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
      for (let i = 0; i < 5; i++) {
        recordLoginAttempt(email, false);
      }
      expect(isAccountLocked(email)).toBe(true);
    });

    it('should unlock account after lock duration', () => {
      const email = 'test@example.com';
      for (let i = 0; i < 5; i++) {
        recordLoginAttempt(email, false);
      }
      
      // Mock time to be after lock duration
      const lockTime = Date.now() - (16 * 60 * 1000); // 16 minutes ago
      localStorageMock[`lockTime_${email}`] = lockTime.toString();
      
      expect(isAccountLocked(email)).toBe(false);
    });
  });

  describe('clearLoginAttempts', () => {
    it('should clear all attempts for an account', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      
      clearLoginAttempts(email);
      
      expect(localStorageMock[`loginAttempts_${email}`]).toBeUndefined();
      expect(localStorageMock[`lockTime_${email}`]).toBeUndefined();
    });

    it('should not affect other accounts', () => {
      const email1 = 'test1@example.com';
      const email2 = 'test2@example.com';
      
      recordLoginAttempt(email1, false);
      recordLoginAttempt(email2, false);
      
      clearLoginAttempts(email1);
      
      expect(localStorageMock[`loginAttempts_${email1}`]).toBeUndefined();
      expect(localStorageMock[`loginAttempts_${email2}`]).toBe('1');
    });
  });
}); 