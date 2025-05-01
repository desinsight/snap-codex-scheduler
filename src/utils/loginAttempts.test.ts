import {
  isAccountLocked,
  recordLoginAttempt,
  clearLoginAttempts,
  MAX_LOGIN_ATTEMPTS,
  LOCK_DURATION
} from './loginAttempts';

<<<<<<< HEAD
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
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  });

  describe('recordLoginAttempt', () => {
    it('should record successful login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, true);
<<<<<<< HEAD
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('0');
=======
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('0');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should record failed login attempt', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
<<<<<<< HEAD
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('1');
=======
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('1');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should increment failed login attempts', () => {
      const email = 'test@example.com';
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
<<<<<<< HEAD
      expect(localStorageMock[`loginAttempts_${email}`]).toBe('3');
=======
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBe('3');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });
  });

  describe('isAccountLocked', () => {
<<<<<<< HEAD
    it('should return false for account with no attempts', () => {
=======
    it('should return false for account with no login attempts', () => {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
      for (let i = 0; i < 5; i++) {
=======
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
        recordLoginAttempt(email, false);
      }
      expect(isAccountLocked(email)).toBe(true);
    });

    it('should unlock account after lock duration', () => {
      const email = 'test@example.com';
<<<<<<< HEAD
      for (let i = 0; i < 5; i++) {
        recordLoginAttempt(email, false);
      }
      
      // Mock time to be after lock duration
      const lockTime = Date.now() - (16 * 60 * 1000); // 16 minutes ago
      localStorageMock[`lockTime_${email}`] = lockTime.toString();
=======
      
      // Record max failed attempts
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
        recordLoginAttempt(email, false);
      }
      
      // Move time forward past lock duration
      jest.advanceTimersByTime(LOCK_DURATION + 1000);
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      
      expect(isAccountLocked(email)).toBe(false);
    });
  });

  describe('clearLoginAttempts', () => {
<<<<<<< HEAD
    it('should clear all attempts for an account', () => {
      const email = 'test@example.com';
=======
    it('should clear all login attempts for an account', () => {
      const email = 'test@example.com';
      
      // Record some failed attempts
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      recordLoginAttempt(email, false);
      recordLoginAttempt(email, false);
      
      clearLoginAttempts(email);
      
<<<<<<< HEAD
      expect(localStorageMock[`loginAttempts_${email}`]).toBeUndefined();
      expect(localStorageMock[`lockTime_${email}`]).toBeUndefined();
=======
      expect(localStorageMock.getItem(`loginAttempts_${email}`)).toBeNull();
      expect(localStorageMock.getItem(`lockTime_${email}`)).toBeNull();
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });

    it('should not affect other accounts', () => {
      const email1 = 'test1@example.com';
      const email2 = 'test2@example.com';
      
      recordLoginAttempt(email1, false);
      recordLoginAttempt(email2, false);
      
      clearLoginAttempts(email1);
      
<<<<<<< HEAD
      expect(localStorageMock[`loginAttempts_${email1}`]).toBeUndefined();
      expect(localStorageMock[`loginAttempts_${email2}`]).toBe('1');
=======
      expect(localStorageMock.getItem(`loginAttempts_${email1}`)).toBeNull();
      expect(localStorageMock.getItem(`loginAttempts_${email2}`)).toBe('1');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });
  });
}); 