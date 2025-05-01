import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { authSlice, login, register, refreshToken } from '../store/slices/authSlice';
import { useEffect } from 'react';
import { isTokenValid, getToken, clearTokens } from '../utils/token';
import { AuthService } from '../services/api/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const { user, token, isAuthenticated, isLoading } = useSelector(
=======
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
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
<<<<<<< HEAD
        } catch {
=======
        } catch (error) {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
          clearTokens();
          dispatch(authSlice.actions.logout());
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  const handleLogin = async (credentials: { email: string; password: string }) => {
<<<<<<< HEAD
    const response = await dispatch(login(credentials)).unwrap();
    return response;
  };

  const handleRegister = async (credentials: { email: string; password: string; name: string }) => {
    const response = await dispatch(register(credentials)).unwrap();
    return response;
=======
    try {
      const response = await dispatch(login(credentials)).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (credentials: { email: string; password: string; name: string }) => {
    try {
      const response = await dispatch(register(credentials)).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  };

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    clearTokens();
  };

  const handleRefreshToken = async () => {
<<<<<<< HEAD
    const response = await dispatch(refreshToken()).unwrap();
    return response;
=======
    try {
      const response = await dispatch(refreshToken()).unwrap();
      return response;
    } catch (error) {
      throw error;
    }
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  };

  const handleClearError = () => {
    dispatch(authSlice.actions.clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
<<<<<<< HEAD
    error: null,
=======
    error,
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    clearError: handleClearError,
  };
}; 