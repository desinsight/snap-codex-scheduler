import {
  saveTokens,
  getToken,
  getRefreshToken,
  getTokenExpiry,
  isTokenValid,
  updateToken,
  clearTokens,
  getTimeUntilExpiry,
  encryptToken,
  decryptToken,
  isTokenExpired,
  getTokenExpiration,
} from './token';

// localStorage 모의 객체 생성
const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// localStorage 모의 객체 설정
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('Token Utils', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('saveTokens', () => {
    it('should save tokens and expiry time', () => {
      const mockAuthResponse = {
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      };

      saveTokens(mockAuthResponse);

      expect(getToken()).toBe('test-token');
      expect(getRefreshToken()).toBe('test-refresh-token');
      expect(getTokenExpiry()).toBeGreaterThan(Date.now());
    });
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(getToken()).toBeNull();
    });

    it('should return stored token', () => {
      mockLocalStorage.setItem('auth_token', 'test-token');
      expect(getToken()).toBe('test-token');
    });
  });

  describe('getRefreshToken', () => {
    it('should return null when no refresh token is stored', () => {
      expect(getRefreshToken()).toBeNull();
    });

    it('should return stored refresh token', () => {
      mockLocalStorage.setItem('refresh_token', 'test-refresh-token');
      expect(getRefreshToken()).toBe('test-refresh-token');
    });
  });

  describe('isTokenValid', () => {
    it('should return false when no token is stored', () => {
      expect(isTokenValid()).toBe(false);
    });

    it('should return false when token is expired', () => {
      mockLocalStorage.setItem('auth_token', 'test-token');
      mockLocalStorage.setItem('token_expiry', (Date.now() - 1000).toString());
      expect(isTokenValid()).toBe(false);
    });

    it('should return true when token is valid', () => {
      mockLocalStorage.setItem('auth_token', 'test-token');
      mockLocalStorage.setItem('token_expiry', (Date.now() + 3600000).toString());
      expect(isTokenValid()).toBe(true);
    });
  });

  describe('updateToken', () => {
    it('should update token and expiry time', () => {
      mockLocalStorage.setItem('auth_token', 'old-token');
      mockLocalStorage.setItem('token_expiry', (Date.now() - 1000).toString());

      updateToken('new-token', 3600);

      expect(getToken()).toBe('new-token');
      expect(getTokenExpiry()).toBeGreaterThan(Date.now());
    });
  });

  describe('clearTokens', () => {
    it('should remove all tokens', () => {
      mockLocalStorage.setItem('auth_token', 'test-token');
      mockLocalStorage.setItem('refresh_token', 'test-refresh-token');
      mockLocalStorage.setItem('token_expiry', Date.now().toString());

      clearTokens();

      expect(getToken()).toBeNull();
      expect(getRefreshToken()).toBeNull();
      expect(getTokenExpiry()).toBeNull();
    });
  });

  describe('getTimeUntilExpiry', () => {
    it('should return null when no expiry time is set', () => {
      expect(getTimeUntilExpiry()).toBeNull();
    });

    it('should return time until expiry', () => {
      const expiryTime = Date.now() + 3600000;
      mockLocalStorage.setItem('token_expiry', expiryTime.toString());

      const timeUntilExpiry = getTimeUntilExpiry();
      expect(timeUntilExpiry).toBeGreaterThan(0);
      expect(timeUntilExpiry).toBeLessThanOrEqual(3600000);
    });

    it('should return 0 when token is expired', () => {
      const expiryTime = Date.now() - 1000;
      mockLocalStorage.setItem('token_expiry', expiryTime.toString());

      expect(getTimeUntilExpiry()).toBe(0);
    });
  });

  describe('token refresh timing', () => {
    it('should indicate token needs refresh when close to expiry', () => {
      const expiryTime = Date.now() + 300000; // 5 minutes
      mockLocalStorage.setItem('token_expiry', expiryTime.toString());

      expect(getTimeUntilExpiry()).toBeLessThanOrEqual(300000);
    });

    it('should indicate token is fresh when far from expiry', () => {
      const expiryTime = Date.now() + 7200000; // 2 hours
      mockLocalStorage.setItem('token_expiry', expiryTime.toString());

      expect(getTimeUntilExpiry()).toBeGreaterThan(300000);
    });
  });
});

describe('Token Management', () => {
  const testToken = 'test-token-123';
  const testKey = 'test-key-456';

  describe('encryptToken and decryptToken', () => {
    it('should encrypt and decrypt token correctly', () => {
      const encrypted = encryptToken(testToken, testKey);
      const decrypted = decryptToken(encrypted, testKey);
      expect(decrypted).toBe(testToken);
    });

    it('should return null when decrypting with wrong key', () => {
      const encrypted = encryptToken(testToken, testKey);
      const decrypted = decryptToken(encrypted, 'wrong-key');
      expect(decrypted).toBeNull();
    });

    it('should return null when decrypting invalid token', () => {
      const decrypted = decryptToken('invalid-token', testKey);
      expect(decrypted).toBeNull();
    });

    it('should handle empty token', () => {
      const encrypted = encryptToken('', testKey);
      const decrypted = decryptToken(encrypted, testKey);
      expect(decrypted).toBe('');
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTY5NzA0MDAsImlhdCI6MTYxNjk3MDQwMH0.';
      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for valid token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MTY5NzA0MDAsImlhdCI6MTYxNjk3MDQwMH0.';
      expect(isTokenExpired(validToken)).toBe(false);
    });

    it('should return true for invalid token', () => {
      const invalidToken = 'invalid-token';
      expect(isTokenExpired(invalidToken)).toBe(true);
    });

    it('should return true for token without expiration', () => {
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTY5NzA0MDB9.';
      expect(isTokenExpired(tokenWithoutExp)).toBe(true);
    });
  });

  describe('getTokenExpiration', () => {
    it('should return correct expiration time', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTY5NzA0MDAsImlhdCI6MTYxNjk3MDQwMH0.';
      const expiration = getTokenExpiration(token);
      expect(expiration).toBe(1616970400);
    });

    it('should return null for invalid token', () => {
      const invalidToken = 'invalid-token';
      const expiration = getTokenExpiration(invalidToken);
      expect(expiration).toBeNull();
    });

    it('should return null for token without expiration', () => {
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTY5NzA0MDB9.';
      const expiration = getTokenExpiration(tokenWithoutExp);
      expect(expiration).toBeNull();
    });
  });
});
