import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    recommendations: [],
    loading: false,
    error: null,
};
export const fetchRecommendations = createAsyncThunk('notificationOptimization/fetchRecommendations', async () => {
    const response = await fetch('/api/notification-optimization/recommendations');
    if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
    }
    return response.json();
});
export const updateRecommendation = createAsyncThunk('notificationOptimization/updateRecommendation', async (recommendation) => {
    const response = await fetch(`/api/notification-optimization/recommendations/${recommendation.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendation),
    });
    if (!response.ok) {
        throw new Error('Failed to update recommendation');
    }
    return response.json();
});
const notificationOptimizationSlice = createSlice({
    name: 'notificationOptimization',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchRecommendations.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
            state.loading = false;
            state.recommendations = action.payload;
        })
            .addCase(fetchRecommendations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch recommendations';
        })
            .addCase(updateRecommendation.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateRecommendation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.recommendations.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.recommendations[index] = action.payload;
            }
        })
            .addCase(updateRecommendation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update recommendation';
        });
    },
});
export default notificationOptimizationSlice.reducer;
