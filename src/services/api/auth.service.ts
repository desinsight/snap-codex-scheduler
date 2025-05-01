import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types/auth';
import { API_URL } from '../../config';
import { getCsrfToken } from '../../utils/csrf';
import { validatePassword } from '../../utils/password';
import { isAccountLocked, recordLoginAttempt } from '../../utils/loginAttempts';
import { User } from '../../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Check if account is locked
    if (isAccountLocked(credentials.email)) {
      throw new Error('Account is temporarily locked due to too many failed attempts');
    }

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      recordLoginAttempt(credentials.email, true);
      return response.data;
    } catch (error) {
      recordLoginAttempt(credentials.email, false);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Validate password strength
    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    const response = await axios.post(`${API_URL}/auth/register`, credentials, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    return response.data;
  },

  logout: async (): Promise<void> => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    await axios.post(`${API_URL}/auth/logout`, null, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    const response = await axios.post(`${API_URL}/auth/refresh-token`, null, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const csrfToken = getCsrfToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    return response.data;
  },
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  async register(userData: Partial<User>): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`);
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/refresh-token`);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  },
}; 