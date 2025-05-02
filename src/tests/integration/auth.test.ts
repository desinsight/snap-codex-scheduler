import { Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockRequest, mockResponse, mockNext, createMockUser } from '../../utils/testUtils';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';

jest.mock('../../services/UserService');
jest.mock('../../services/AuthService');

describe('Auth Middleware', () => {
  let userService: jest.Mocked<UserService>;
  let authService: jest.Mocked<AuthService>;
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    authService = new AuthService() as jest.Mocked<AuthService>;
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Validation', () => {
    it('should call next() when valid token is provided', async () => {
      const mockUser = createMockUser();
      const token = 'valid-token';

      req.headers.authorization = `Bearer ${token}`;
      authService.validateToken.mockResolvedValue({ userId: mockUser.id });
      userService.getUserById.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(authService.validateToken).toHaveBeenCalledWith(token);
      expect(userService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when invalid token is provided', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      authService.validateToken.mockRejectedValue(new Error('Invalid token'));

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Role-based Access', () => {
    it('should allow access for admin role', async () => {
      const mockAdmin = createMockUser({ role: 'admin' });
      const token = 'valid-token';

      req.headers.authorization = `Bearer ${token}`;
      authService.validateToken.mockResolvedValue({ userId: mockAdmin.id });
      userService.getUserById.mockResolvedValue(mockAdmin);

      await authMiddleware(req, res, next);

      expect(req.user).toEqual(mockAdmin);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 for insufficient permissions', async () => {
      const mockUser = createMockUser({ role: 'user' });
      const token = 'valid-token';

      req.headers.authorization = `Bearer ${token}`;
      authService.validateToken.mockResolvedValue({ userId: mockUser.id });
      userService.getUserById.mockResolvedValue(mockUser);
      req.path = '/admin-only';

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Token Expiration', () => {
    it('should handle expired token', async () => {
      const token = 'expired-token';
      req.headers.authorization = `Bearer ${token}`;
      authService.validateToken.mockRejectedValue(new Error('Token expired'));

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token expired' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle token refresh', async () => {
      const mockUser = createMockUser();
      const oldToken = 'expired-token';
      const newToken = 'new-token';

      req.headers.authorization = `Bearer ${oldToken}`;
      authService.validateToken.mockRejectedValueOnce(new Error('Token expired'));
      authService.refreshToken.mockResolvedValueOnce(newToken);
      authService.validateToken.mockResolvedValueOnce({ userId: mockUser.id });
      userService.getUserById.mockResolvedValue(mockUser);

      await authMiddleware(req, res, next);

      expect(authService.refreshToken).toHaveBeenCalledWith(oldToken);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });
  });
}); 