import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FollowUpAutomationState, FollowUpRule } from '../../types/notification';

const initialState: FollowUpAutomationState = {
  rules: [],
  loading: false,
  error: null,
};

export const fetchFollowUpRules = createAsyncThunk(
  'followUpAutomation/fetchRules',
  async () => {
    const response = await fetch('/api/follow-up-rules');
    if (!response.ok) {
      throw new Error('Failed to fetch follow-up rules');
    }
    return response.json();
  }
);

export const createFollowUpRule = createAsyncThunk(
  'followUpAutomation/createRule',
  async (rule: Omit<FollowUpRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/follow-up-rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });
    if (!response.ok) {
      throw new Error('Failed to create follow-up rule');
    }
    return response.json();
  }
);

export const updateFollowUpRule = createAsyncThunk(
  'followUpAutomation/updateRule',
  async (rule: FollowUpRule) => {
    const response = await fetch(`/api/follow-up-rules/${rule.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rule),
    });
    if (!response.ok) {
      throw new Error('Failed to update follow-up rule');
    }
    return response.json();
  }
);

export const deleteFollowUpRule = createAsyncThunk(
  'followUpAutomation/deleteRule',
  async (ruleId: string) => {
    const response = await fetch(`/api/follow-up-rules/${ruleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete follow-up rule');
    }
    return ruleId;
  }
);

export const toggleFollowUpRule = createAsyncThunk(
  'followUpAutomation/toggleRule',
  async (ruleId: string) => {
    const response = await fetch(`/api/follow-up-rules/${ruleId}/toggle`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle follow-up rule');
    }
    return response.json();
  }
);

const followUpAutomationSlice = createSlice({
  name: 'followUpAutomation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowUpRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowUpRules.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchFollowUpRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch follow-up rules';
      })
      .addCase(createFollowUpRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFollowUpRule.fulfilled, (state, action) => {
        state.loading = false;
        state.rules.push(action.payload);
      })
      .addCase(createFollowUpRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create follow-up rule';
      })
      .addCase(updateFollowUpRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFollowUpRule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rules.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        }
      })
      .addCase(updateFollowUpRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update follow-up rule';
      })
      .addCase(deleteFollowUpRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFollowUpRule.fulfilled, (state, action) => {
        state.loading = false;
        state.rules = state.rules.filter((rule) => rule.id !== action.payload);
      })
      .addCase(deleteFollowUpRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete follow-up rule';
      })
      .addCase(toggleFollowUpRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFollowUpRule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.rules.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        }
      })
      .addCase(toggleFollowUpRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle follow-up rule';
      });
  },
});

export default followUpAutomationSlice.reducer; 