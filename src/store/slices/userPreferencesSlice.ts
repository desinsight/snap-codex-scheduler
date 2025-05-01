import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserNotificationPreferences, UserPreferencesState } from '../types/notification';

const initialState: UserPreferencesState = {
  preferences: [],
  loading: false,
  error: null,
};

export const fetchUserPreferences = createAsyncThunk(
  'preferences/fetchPreferences',
  async () => {
    const response = await fetch('/api/user-preferences');
    if (!response.ok) {
      throw new Error('Failed to fetch user preferences');
    }
    return response.json();
  }
);

export const updateUserPreferences = createAsyncThunk(
  'preferences/updatePreferences',
  async (preferences: UserNotificationPreferences) => {
    const response = await fetch(`/api/user-preferences/${preferences.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error('Failed to update user preferences');
    }
    return response.json();
  }
);

export const submitFeedback = createAsyncThunk(
  'preferences/submitFeedback',
  async ({ userId, satisfactionScore, feedbackText }: { userId: string; satisfactionScore: number; feedbackText?: string }) => {
    const response = await fetch(`/api/user-preferences/${userId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ satisfactionScore, feedbackText }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    return response.json();
  }
);

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user preferences';
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        const index = state.preferences.findIndex((p) => p.userId === action.payload.userId);
        if (index !== -1) {
          state.preferences[index] = action.payload;
        } else {
          state.preferences.push(action.payload);
        }
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        const index = state.preferences.findIndex((p) => p.userId === action.payload.userId);
        if (index !== -1) {
          state.preferences[index].feedback = action.payload.feedback;
        }
      });
  },
});

export default userPreferencesSlice.reducer; 