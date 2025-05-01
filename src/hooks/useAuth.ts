import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { authSlice, login, register, refreshToken } from '../store/slices/authSlice';
import { useEffect } from 'react';
import { isTokenValid, getToken, clearTokens } from '../utils/token';
import { AuthService } from '../services/api/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  // 자동 로그인 체크
  useEffect(() => {
    const checkAuth = async () => {
      if (isTokenValid()) {
        const storedToken = getToken();
        try {
          const userData = await AuthService.getCurrentUser();
          dispatch(authSlice.actions.setUser(userData));
          dispatch(authSlice.actions.setToken(storedToken));
        } catch {
          clearTokens();
          dispatch(authSlice.actions.logout());
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    const response = await dispatch(login(credentials)).unwrap();
    return response;
  };

  const handleRegister = async (credentials: { email: string; password: string; name: string }) => {
    const response = await dispatch(register(credentials)).unwrap();
    return response;
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    clearTokens();
  };

  const handleRefreshToken = async () => {
    const response = await dispatch(refreshToken()).unwrap();
    return response;
  };

  const handleClearError = () => {
    dispatch(authSlice.actions.clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error: null,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    clearError: handleClearError,
  };
}; 