import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types/auth';
import { API_URL } from '../../config';
import { getCsrfToken } from '../../utils/csrf';
import { handleApiError } from '../../utils/errorHandling';

class AuthService {
  private baseUrl = '/api/auth';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, credentials);
    return response.data;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/refresh-token`);
    return response.data;
  }

  static async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`);
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

export default AuthService; 