import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    isLoading: false,
    loadingMessage: null,
    loadingProgress: null,
};
const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        startLoading: (state, action) => {
            state.isLoading = true;
            state.loadingMessage = action.payload.message || null;
            state.loadingProgress = action.payload.progress || null;
        },
        updateLoadingProgress: (state, action) => {
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
