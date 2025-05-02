import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    rules: [],
    loading: false,
    error: null,
};
export const fetchAutomationRules = createAsyncThunk('automation/fetchRules', async () => {
    const response = await fetch('/api/automation/rules');
    if (!response.ok) {
        throw new Error('Failed to fetch automation rules');
    }
    return response.json();
});
export const createAutomationRule = createAsyncThunk('automation/createRule', async (rule) => {
    const response = await fetch('/api/automation/rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to create automation rule');
    }
    return response.json();
});
export const updateAutomationRule = createAsyncThunk('automation/updateRule', async (rule) => {
    const response = await fetch(`/api/automation/rules/${rule.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to update automation rule');
    }
    return response.json();
});
export const deleteAutomationRule = createAsyncThunk('automation/deleteRule', async (ruleId) => {
    const response = await fetch(`/api/automation/rules/${ruleId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete automation rule');
    }
    return ruleId;
});
export const toggleAutomationRule = createAsyncThunk('automation/toggleRule', async (ruleId) => {
    const response = await fetch(`/api/automation/rules/${ruleId}/toggle`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        throw new Error('Failed to toggle automation rule');
    }
    return response.json();
});
const automationSlice = createSlice({
    name: 'automation',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAutomationRules.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchAutomationRules.fulfilled, (state, action) => {
            state.loading = false;
            state.rules = action.payload;
        })
            .addCase(fetchAutomationRules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch automation rules';
        })
            .addCase(createAutomationRule.fulfilled, (state, action) => {
            state.rules.push(action.payload);
        })
            .addCase(updateAutomationRule.fulfilled, (state, action) => {
            const index = state.rules.findIndex(rule => rule.id === action.payload.id);
            if (index !== -1) {
                state.rules[index] = action.payload;
            }
        })
            .addCase(deleteAutomationRule.fulfilled, (state, action) => {
            state.rules = state.rules.filter(rule => rule.id !== action.payload);
        })
            .addCase(toggleAutomationRule.fulfilled, (state, action) => {
            const index = state.rules.findIndex(rule => rule.id === action.payload.id);
            if (index !== -1) {
                state.rules[index] = action.payload;
            }
        });
    },
});
export default automationSlice.reducer;
