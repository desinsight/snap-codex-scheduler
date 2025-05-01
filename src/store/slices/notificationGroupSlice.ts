import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationGroup, NotificationGroupState } from '../../types/notification';

const initialState: NotificationGroupState = {
  groups: [],
  loading: false,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  'notificationGroups/fetchGroups',
  async () => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/notification-groups');
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    return response.json();
  }
);

export const createGroup = createAsyncThunk(
  'notificationGroups/createGroup',
  async (group: Omit<NotificationGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/notification-groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) {
      throw new Error('Failed to create group');
    }
    return response.json();
  }
);

export const updateGroup = createAsyncThunk(
  'notificationGroups/updateGroup',
  async (group: NotificationGroup) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/notification-groups/${group.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(group),
    });
    if (!response.ok) {
      throw new Error('Failed to update group');
    }
    return response.json();
  }
);

export const deleteGroup = createAsyncThunk(
  'notificationGroups/deleteGroup',
  async (groupId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/notification-groups/${groupId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }
    return groupId;
  }
);

export const toggleGroupActive = createAsyncThunk(
  'notificationGroups/toggleGroupActive',
  async ({ groupId, isActive }: { groupId: string; isActive: boolean }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/notification-groups/${groupId}/active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle group active state');
    }
    return response.json();
  }
);

const notificationGroupSlice = createSlice({
  name: 'notificationGroups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch groups';
      })
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create group';
      })
      // Update group
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update group';
      })
      // Delete group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter((g) => g.id !== action.payload);
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete group';
      })
      // Toggle group active
      .addCase(toggleGroupActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleGroupActive.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(toggleGroupActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to toggle group active state';
      });
  },
});

export default notificationGroupSlice.reducer; 