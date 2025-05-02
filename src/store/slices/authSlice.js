import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/api/auth.service';
import { saveTokens, updateToken } from '../../utils/token';
const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
};
export const login = createAsyncThunk('auth/login', async (credentials) => {
    const response = await AuthService.login(credentials);
    saveTokens(response);
    return response;
});
export const register = createAsyncThunk('auth/register', async (credentials) => {
    const response = await AuthService.register(credentials);
    saveTokens(response);
    return response;
});
export const refreshToken = createAsyncThunk('auth/refreshToken', async () => {
    const response = await AuthService.refreshToken();
    updateToken(response.token, response.expiresIn);
    return response;
});
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
            .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to login';
        })
            .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        })
            .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to register';
        })
            .addCase(refreshToken.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(refreshToken.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
        })
            .addCase(refreshToken.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to refresh token';
        });
    }
});
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
