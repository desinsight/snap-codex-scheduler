import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationSettings, NotificationHistory } from '../../types/notification';

interface NotificationState {
  settings: NotificationSettings[];
  history: NotificationHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  settings: [],
  history: [],
  loading: false,
  error: null,
};

export const fetchNotificationSettings = createAsyncThunk(
  'notifications/fetchSettings',
  async (scheduleId: string) => {
    const response = await fetch(`/api/schedules/${scheduleId}/notifications`);
    if (!response.ok) {
      throw new Error('Failed to fetch notification settings');
    }
    return response.json();
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (settings: NotificationSettings) => {
    const response = await fetch(`/api/notifications/${settings.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update notification settings');
    }
    return response.json();
  }
);

export const fetchNotificationHistory = createAsyncThunk(
  'notifications/fetchHistory',
  async (scheduleId: string) => {
    const response = await fetch(`/api/schedules/${scheduleId}/notifications/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch notification history');
    }
    return response.json();
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification settings';
      })
      // Update Settings
      .addCase(updateNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.settings.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.settings[index] = action.payload;
        }
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update notification settings';
      })
      // Fetch History
      .addCase(fetchNotificationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchNotificationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification history';
      });
  },
});

export default notificationSlice.reducer; 