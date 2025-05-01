import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '../../services/api/auth.service';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../../types/auth';
import { saveTokens, updateToken, clearTokens } from '../../utils/token';
<<<<<<< HEAD
import { AxiosError } from 'axios';

interface AuthState {
  user: User | null;
  token: {
    accessToken: string;
  } | null;
=======

interface AuthState {
  user: User | null;
  token: string | null;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(credentials);
      saveTokens(response);
      return response;
<<<<<<< HEAD
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Login failed');
=======
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterCredentials>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(credentials);
      saveTokens(response);
      return response;
<<<<<<< HEAD
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Registration failed');
=======
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    }
  }
);

export const refreshToken = createAsyncThunk<AuthResponse, void>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.refreshToken();
      updateToken(response.token, response.expiresIn);
      return response;
<<<<<<< HEAD
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      clearTokens();
      return rejectWithValue(axiosError.response?.data?.message || 'Token refresh failed');
=======
    } catch (error: any) {
      clearTokens();
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
<<<<<<< HEAD
        state.token = { accessToken: action.payload.token };
=======
        state.token = action.payload.token;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
<<<<<<< HEAD
        state.token = { accessToken: action.payload.token };
=======
        state.token = action.payload.token;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
<<<<<<< HEAD
        state.token = { accessToken: action.payload.token };
=======
        state.token = action.payload.token;
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { setUser, setToken, logout, clearError } = authSlice.actions;
export default authSlice.reducer; 