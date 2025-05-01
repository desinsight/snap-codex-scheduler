import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PerformanceReport, AnalysisState } from '../types/notification';

const initialState: AnalysisState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

export const fetchPerformanceReports = createAsyncThunk(
  'analysis/fetchReports',
  async () => {
    const response = await fetch('/api/analysis/reports');
    if (!response.ok) {
      throw new Error('Failed to fetch performance reports');
    }
    return response.json();
  }
);

export const generatePerformanceReport = createAsyncThunk(
  'analysis/generateReport',
  async (params: { type: 'weekly' | 'monthly'; startDate: string; endDate: string }) => {
    const response = await fetch('/api/analysis/reports/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error('Failed to generate performance report');
    }
    return response.json();
  }
);

export const fetchReportById = createAsyncThunk(
  'analysis/fetchReportById',
  async (reportId: string) => {
    const response = await fetch(`/api/analysis/reports/${reportId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    return response.json();
  }
);

export const exportReport = createAsyncThunk(
  'analysis/exportReport',
  async (reportId: string) => {
    const response = await fetch(`/api/analysis/reports/${reportId}/export`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to export report');
    }
    return response.blob();
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchPerformanceReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch performance reports';
      })
      .addCase(generatePerformanceReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
        state.currentReport = action.payload;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.currentReport = action.payload;
      });
  },
});

export const { clearCurrentReport } = analysisSlice.actions;
export default analysisSlice.reducer; 