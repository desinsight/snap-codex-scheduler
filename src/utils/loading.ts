import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string | null;
  loadingProgress: number | null;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: null,
  loadingProgress: null,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<{ message?: string; progress?: number }>) => {
      state.isLoading = true;
      state.loadingMessage = action.payload.message || null;
      state.loadingProgress = action.payload.progress || null;
    },
    updateLoadingProgress: (state, action: PayloadAction<number>) => {
      state.loadingProgress = action.payload;
    },
    stopLoading: state => {
      state.isLoading = false;
      state.loadingMessage = null;
      state.loadingProgress = null;
    },
  },
});

export const { startLoading, updateLoadingProgress, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
