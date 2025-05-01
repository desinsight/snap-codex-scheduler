import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  NotificationAnalyticsState,
  NotificationStats,
  UserBehaviorPattern,
  NotificationFatigue,
  SmartNotificationSettings,
} from '../../types/notification';

const initialState: NotificationAnalyticsState = {
  stats: {
    successRate: 0,
    totalSent: 0,
    totalSuccess: 0,
    totalFailed: 0,
    hourlyDistribution: [],
    categoryDistribution: [],
    failureReasons: [],
    userResponseRates: [],
  },
  userPatterns: [],
  fatigueLevels: [],
  smartSettings: [],
  loading: false,
  error: null,
};

export const fetchNotificationStats = createAsyncThunk(
  'notificationAnalytics/fetchStats',
  async () => {
    const response = await fetch('/api/notification-analytics/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch notification stats');
    }
    return response.json();
  }
);

export const fetchUserBehaviorPatterns = createAsyncThunk(
  'notificationAnalytics/fetchUserPatterns',
  async () => {
    const response = await fetch('/api/notification-analytics/user-patterns');
    if (!response.ok) {
      throw new Error('Failed to fetch user behavior patterns');
    }
    return response.json();
  }
);

export const fetchFatigueLevels = createAsyncThunk(
  'notificationAnalytics/fetchFatigueLevels',
  async () => {
    const response = await fetch('/api/notification-analytics/fatigue-levels');
    if (!response.ok) {
      throw new Error('Failed to fetch fatigue levels');
    }
    return response.json();
  }
);

export const fetchSmartSettings = createAsyncThunk(
  'notificationAnalytics/fetchSmartSettings',
  async () => {
    const response = await fetch('/api/notification-analytics/smart-settings');
    if (!response.ok) {
      throw new Error('Failed to fetch smart settings');
    }
    return response.json();
  }
);

export const updateSmartSettings = createAsyncThunk(
  'notificationAnalytics/updateSmartSettings',
  async (settings: SmartNotificationSettings) => {
    const response = await fetch(`/api/notification-analytics/smart-settings/${settings.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update smart settings');
    }
    return response.json();
  }
);

export const adjustNotificationTiming = createAsyncThunk(
  'notificationAnalytics/adjustTiming',
  async (userId: string) => {
    const response = await fetch(`/api/notification-analytics/adjust-timing/${userId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to adjust notification timing');
    }
    return response.json();
  }
);

export const updateFatigueSettings = createAsyncThunk(
  'notificationAnalytics/updateFatigueSettings',
  async (fatigue: NotificationFatigue) => {
    const response = await fetch(`/api/notification-analytics/fatigue-settings/${fatigue.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fatigue),
    });
    if (!response.ok) {
      throw new Error('Failed to update fatigue settings');
    }
    return response.json();
  }
);

const notificationAnalyticsSlice = createSlice({
  name: 'notificationAnalytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotificationStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification stats';
      })
      .addCase(fetchUserBehaviorPatterns.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBehaviorPatterns.fulfilled, (state, action) => {
        state.loading = false;
        state.userPatterns = action.payload;
      })
      .addCase(fetchUserBehaviorPatterns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user behavior patterns';
      })
      .addCase(fetchFatigueLevels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFatigueLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.fatigueLevels = action.payload;
      })
      .addCase(fetchFatigueLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch fatigue levels';
      })
      .addCase(fetchSmartSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSmartSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.smartSettings = action.payload;
      })
      .addCase(fetchSmartSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch smart settings';
      })
      .addCase(updateSmartSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSmartSettings.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.smartSettings.findIndex(s => s.userId === action.payload.userId);
        if (index !== -1) {
          state.smartSettings[index] = action.payload;
        }
      })
      .addCase(updateSmartSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update smart settings';
      })
      .addCase(adjustNotificationTiming.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adjustNotificationTiming.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.smartSettings.findIndex(s => s.userId === action.payload.userId);
        if (index !== -1) {
          state.smartSettings[index] = action.payload;
        }
      })
      .addCase(adjustNotificationTiming.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to adjust notification timing';
      })
      .addCase(updateFatigueSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFatigueSettings.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.fatigueLevels.findIndex(f => f.userId === action.payload.userId);
        if (index !== -1) {
          state.fatigueLevels[index] = action.payload;
        }
      })
      .addCase(updateFatigueSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update fatigue settings';
      });
  },
});

export default notificationAnalyticsSlice.reducer;
