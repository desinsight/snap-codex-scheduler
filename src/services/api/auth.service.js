import axios from 'axios';
import { API_URL } from '../../config';
import { handleApiError } from '../../utils/errorHandling';
class AuthService {
    baseUrl = '/api/auth';
    static async login(credentials) {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    }
    static async register(credentials) {
        const response = await axios.post(`${API_URL}/auth/register`, credentials);
        return response.data;
    }
    static async refreshToken() {
        const response = await axios.post(`${API_URL}/auth/refresh-token`);
        return response.data;
    }
    static async logout() {
        await axios.post(`${API_URL}/auth/logout`);
    }
    async getCurrentUser() {
        try {
            const response = await axios.get(`${this.baseUrl}/me`);
            return response.data;
        }
        catch (error) {
            throw handleApiError(error);
        }
    }
}
export default AuthService;
