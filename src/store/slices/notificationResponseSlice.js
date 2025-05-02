import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const initialState = {
    responses: [],
    followUps: [],
    channelTemplates: [],
    channelStatuses: [],
    channelSwitchRules: [],
    loading: false,
    error: null,
};
export const fetchResponses = createAsyncThunk('notificationResponse/fetchResponses', async () => {
    const response = await fetch('/api/notification-responses');
    if (!response.ok) {
        throw new Error('Failed to fetch notification responses');
    }
    return response.json();
});
export const fetchFollowUps = createAsyncThunk('notificationResponse/fetchFollowUps', async () => {
    const response = await fetch('/api/notification-follow-ups');
    if (!response.ok) {
        throw new Error('Failed to fetch follow-up notifications');
    }
    return response.json();
});
export const fetchChannelTemplates = createAsyncThunk('notificationResponse/fetchChannelTemplates', async () => {
    const response = await fetch('/api/channel-templates');
    if (!response.ok) {
        throw new Error('Failed to fetch channel templates');
    }
    return response.json();
});
export const fetchChannelStatuses = createAsyncThunk('notificationResponse/fetchChannelStatuses', async () => {
    const response = await fetch('/api/channel-statuses');
    if (!response.ok) {
        throw new Error('Failed to fetch channel statuses');
    }
    return response.json();
});
export const fetchChannelSwitchRules = createAsyncThunk('notificationResponse/fetchChannelSwitchRules', async () => {
    const response = await fetch('/api/channel-switch-rules');
    if (!response.ok) {
        throw new Error('Failed to fetch channel switch rules');
    }
    return response.json();
});
export const createChannelTemplate = createAsyncThunk('notificationResponse/createChannelTemplate', async (template) => {
    const response = await fetch('/api/channel-templates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
    });
    if (!response.ok) {
        throw new Error('Failed to create channel template');
    }
    return response.json();
});
export const updateChannelTemplate = createAsyncThunk('notificationResponse/updateChannelTemplate', async (template) => {
    const response = await fetch(`/api/channel-templates/${template.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
    });
    if (!response.ok) {
        throw new Error('Failed to update channel template');
    }
    return response.json();
});
export const createChannelSwitchRule = createAsyncThunk('notificationResponse/createChannelSwitchRule', async (rule) => {
    const response = await fetch('/api/channel-switch-rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to create channel switch rule');
    }
    return response.json();
});
export const updateChannelSwitchRule = createAsyncThunk('notificationResponse/updateChannelSwitchRule', async (rule) => {
    const response = await fetch(`/api/channel-switch-rules/${rule.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
    });
    if (!response.ok) {
        throw new Error('Failed to update channel switch rule');
    }
    return response.json();
});
export const scheduleFollowUp = createAsyncThunk('notificationResponse/scheduleFollowUp', async (followUp) => {
    const response = await fetch('/api/notification-follow-ups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUp),
    });
    if (!response.ok) {
        throw new Error('Failed to schedule follow-up notification');
    }
    return response.json();
});
const notificationResponseSlice = createSlice({
    name: 'notificationResponse',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchResponses.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchResponses.fulfilled, (state, action) => {
            state.loading = false;
            state.responses = action.payload;
        })
            .addCase(fetchResponses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch notification responses';
        })
            .addCase(fetchFollowUps.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchFollowUps.fulfilled, (state, action) => {
            state.loading = false;
            state.followUps = action.payload;
        })
            .addCase(fetchFollowUps.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch follow-up notifications';
        })
            .addCase(fetchChannelTemplates.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchChannelTemplates.fulfilled, (state, action) => {
            state.loading = false;
            state.channelTemplates = action.payload;
        })
            .addCase(fetchChannelTemplates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch channel templates';
        })
            .addCase(fetchChannelStatuses.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchChannelStatuses.fulfilled, (state, action) => {
            state.loading = false;
            state.channelStatuses = action.payload;
        })
            .addCase(fetchChannelStatuses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch channel statuses';
        })
            .addCase(fetchChannelSwitchRules.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchChannelSwitchRules.fulfilled, (state, action) => {
            state.loading = false;
            state.channelSwitchRules = action.payload;
        })
            .addCase(fetchChannelSwitchRules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch channel switch rules';
        })
            .addCase(createChannelTemplate.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createChannelTemplate.fulfilled, (state, action) => {
            state.loading = false;
            state.channelTemplates.push(action.payload);
        })
            .addCase(createChannelTemplate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create channel template';
        })
            .addCase(updateChannelTemplate.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateChannelTemplate.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.channelTemplates.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.channelTemplates[index] = action.payload;
            }
        })
            .addCase(updateChannelTemplate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update channel template';
        })
            .addCase(createChannelSwitchRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createChannelSwitchRule.fulfilled, (state, action) => {
            state.loading = false;
            state.channelSwitchRules.push(action.payload);
        })
            .addCase(createChannelSwitchRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create channel switch rule';
        })
            .addCase(updateChannelSwitchRule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateChannelSwitchRule.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.channelSwitchRules.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.channelSwitchRules[index] = action.payload;
            }
        })
            .addCase(updateChannelSwitchRule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update channel switch rule';
        })
            .addCase(scheduleFollowUp.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(scheduleFollowUp.fulfilled, (state, action) => {
            state.loading = false;
            state.followUps.push(action.payload);
        })
            .addCase(scheduleFollowUp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to schedule follow-up notification';
        });
    },
});
export default notificationResponseSlice.reducer;
