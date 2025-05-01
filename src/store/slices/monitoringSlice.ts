import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MonitoringDashboard, MonitoringState } from '../types/notification';

const initialState: MonitoringState = {
  dashboard: null,
  loading: false,
  error: null,
};

export const fetchMonitoringDashboard = createAsyncThunk(
  'monitoring/fetchDashboard',
  async () => {
    const response = await fetch('/api/monitoring/dashboard');
    if (!response.ok) {
      throw new Error('Failed to fetch monitoring dashboard');
    }
    return response.json();
  }
);

export const subscribeToRealtimeUpdates = createAsyncThunk(
  'monitoring/subscribe',
  async (_, { dispatch }) => {
    const eventSource = new EventSource('/api/monitoring/updates');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(updateDashboard(data));
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return eventSource;
  }
);

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState,
  reducers: {
    updateDashboard: (state, action) => {
      if (state.dashboard) {
        state.dashboard = {
          ...state.dashboard,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitoringDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitoringDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchMonitoringDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch monitoring dashboard';
      });
  },
});

export const { updateDashboard } = monitoringSlice.actions;
export default monitoringSlice.reducer; 