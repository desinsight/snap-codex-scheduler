import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types/auth';
import { API_URL } from '../../config';
import { getCsrfToken } from '../../utils/csrf';
import { handleApiError } from '../../utils/errorHandling';

class AuthService {
  private baseUrl = `${API_URL}/auth`;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, credentials, {
        headers: {
          'X-CSRF-Token': getCsrfToken(),
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, credentials, {
        headers: {
          'X-CSRF-Token': getCsrfToken(),
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/refresh-token`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/logout`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new AuthService(); 