import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    metrics: [],
    rules: [],
    loading: false,
    error: null,
};
export const fetchChannelMetrics = createAsyncThunk('channelOptimization/fetchMetrics', async () => {
    const response = await fetch('/api/channel-metrics');
    if (!response.ok) {
        throw new Error('Failed to fetch channel metrics');
    }
    return response.json();
});
export const fetchOptimizationRules = createAsyncThunk('channelOptimization/fetchRules', async () => {
    const response = await fetch('/api/channel-optimization-rules');
    if (!response.ok) {
        throw new Error('Failed to fetch optimization rules');
    }
    return response.json();
});
export const createOptimizationRule = createAsyncThunk('channelOptimization/createRule', async (rule) => {
    const response = await fetch('/api/channel-optimization-rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to create optimization rule');
    }
    return response.json();
});
export const updateOptimizationRule = createAsyncThunk('channelOptimization/updateRule', async (rule) => {
    const response = await fetch(`/api/channel-optimization-rules/${rule.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to update optimization rule');
    }
    return response.json();
});
export const deleteOptimizationRule = createAsyncThunk('channelOptimization/deleteRule', async (ruleId) => {
    const response = await fetch(`/api/channel-optimization-rules/${ruleId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete optimization rule');
    }
    return ruleId;
});
export const toggleOptimizationRule = createAsyncThunk('channelOptimization/toggleRule', async (ruleId) => {
    const response = await fetch(`/api/channel-optimization-rules/${ruleId}/toggle`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error('Failed to toggle optimization rule');
    }
    return response.json();
});
const channelOptimizationSlice = createSlice({
    name: 'channelOptimization',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchChannelMetrics.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchChannelMetrics.fulfilled, (state, action) => {
            state.loading = false;
            state.metrics = action.payload;
        })
            .addCase(fetchChannelMetrics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch channel metrics';
        })
            .addCase(fetchOptimizationRules.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchOptimizationRules.fulfilled, (state, action) => {
            state.loading = false;
            state.rules = action.payload;
        })
            .addCase(fetchOptimizationRules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch optimization rules';
        })
            .addCase(createOptimizationRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createOptimizationRule.fulfilled, (state, action) => {
            state.loading = false;
            state.rules.push(action.payload);
        })
            .addCase(createOptimizationRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create optimization rule';
        })
            .addCase(updateOptimizationRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateOptimizationRule.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.rules.findIndex(rule => rule.id === action.payload.id);
            if (index !== -1) {
                state.rules[index] = action.payload;
            }
        })
            .addCase(updateOptimizationRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update optimization rule';
        })
            .addCase(deleteOptimizationRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteOptimizationRule.fulfilled, (state, action) => {
            state.loading = false;
            state.rules = state.rules.filter(rule => rule.id !== action.payload);
        })
            .addCase(deleteOptimizationRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete optimization rule';
        })
            .addCase(toggleOptimizationRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(toggleOptimizationRule.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.rules.findIndex(rule => rule.id === action.payload.id);
            if (index !== -1) {
                state.rules[index] = action.payload;
            }
        })
            .addCase(toggleOptimizationRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to toggle optimization rule';
        });
    },
});
export default channelOptimizationSlice.reducer;
