import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserBehaviorState, UserBehaviorPattern } from '../../types/notification';

const initialState: UserBehaviorState = {
  patterns: [],
  loading: false,
  error: null,
};

export const fetchUserBehaviorPatterns = createAsyncThunk(
  'userBehavior/fetchPatterns',
  async () => {
    const response = await fetch('/api/user-behavior/patterns');
    if (!response.ok) {
      throw new Error('Failed to fetch user behavior patterns');
    }
    return response.json();
  }
);

export const updateUserBehaviorPattern = createAsyncThunk(
  'userBehavior/updatePattern',
  async (pattern: UserBehaviorPattern) => {
    const response = await fetch(`/api/user-behavior/patterns/${pattern.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pattern),
    });
    if (!response.ok) {
      throw new Error('Failed to update user behavior pattern');
    }
    return response.json();
  }
);

const userBehaviorSlice = createSlice({
  name: 'userBehavior',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserBehaviorPatterns.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBehaviorPatterns.fulfilled, (state, action) => {
        state.loading = false;
        state.patterns = action.payload;
      })
      .addCase(fetchUserBehaviorPatterns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user behavior patterns';
      })
      .addCase(updateUserBehaviorPattern.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserBehaviorPattern.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patterns.findIndex(p => p.userId === action.payload.userId);
        if (index !== -1) {
          state.patterns[index] = action.payload;
        }
      })
      .addCase(updateUserBehaviorPattern.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user behavior pattern';
      });
  },
});

export default userBehaviorSlice.reducer;
