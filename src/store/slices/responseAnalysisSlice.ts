import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ResponseAnalysisState, ResponseAnalysisReport } from '../../types/notification';

const initialState: ResponseAnalysisState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

export const fetchReports = createAsyncThunk(
  'responseAnalysis/fetchReports',
  async () => {
    const response = await fetch('/api/notification-analysis/reports');
    if (!response.ok) {
      throw new Error('Failed to fetch analysis reports');
    }
    return response.json();
  }
);

export const fetchReportById = createAsyncThunk(
  'responseAnalysis/fetchReportById',
  async (reportId: string) => {
    const response = await fetch(`/api/notification-analysis/reports/${reportId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    return response.json();
  }
);

export const generateReport = createAsyncThunk(
  'responseAnalysis/generateReport',
  async (period: { start: Date; end: Date }) => {
    const response = await fetch('/api/notification-analysis/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(period),
    });
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    return response.json();
  }
);

export const exportReport = createAsyncThunk(
  'responseAnalysis/exportReport',
  async (reportId: string) => {
    const response = await fetch(`/api/notification-analysis/reports/${reportId}/export`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to export report');
    }
    return response.blob();
  }
);

const responseAnalysisSlice = createSlice({
  name: 'responseAnalysis',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reports';
      })
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report';
      })
      .addCase(generateReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
        state.reports.push(action.payload);
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate report';
      })
      .addCase(exportReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export report';
      });
  },
});

export const { clearCurrentReport } = responseAnalysisSlice.actions;
export default responseAnalysisSlice.reducer; 