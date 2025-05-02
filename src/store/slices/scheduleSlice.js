import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleService } from '../../services/api/schedule.service';
const initialState = {
    schedules: [],
    selectedSchedule: null,
    stats: null,
    loading: false,
    error: null,
    filter: {},
};
export const fetchSchedules = createAsyncThunk('schedules/fetchAll', async (filter) => {
    return await scheduleService.getSchedules(filter);
});
export const fetchScheduleById = createAsyncThunk('schedules/fetchById', async (id) => {
    return await scheduleService.getScheduleById(id);
});
export const createSchedule = createAsyncThunk('schedules/create', async (schedule) => {
    return await scheduleService.createSchedule(schedule);
});
export const updateSchedule = createAsyncThunk('schedules/update', async ({ id, schedule }) => {
    return await scheduleService.updateSchedule(id, schedule);
});
export const deleteSchedule = createAsyncThunk('schedules/delete', async (id) => {
    await scheduleService.deleteSchedule(id);
    return id;
});
export const fetchScheduleStats = createAsyncThunk('schedules/fetchStats', async () => {
    return await scheduleService.getScheduleStats();
});
export const exportSchedules = createAsyncThunk('schedules/export', async () => {
    return await scheduleService.exportSchedules();
});
const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        clearError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            // Fetch Schedules
            .addCase(fetchSchedules.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
            state.loading = false;
            state.schedules = action.payload;
        })
            .addCase(fetchSchedules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch schedules';
        })
            // Fetch Schedule by ID
            .addCase(fetchScheduleById.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchScheduleById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedSchedule = action.payload;
        })
            .addCase(fetchScheduleById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch schedule';
        })
            // Create Schedule
            .addCase(createSchedule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(createSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.schedules.push(action.payload);
        })
            .addCase(createSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to create schedule';
        })
            // Update Schedule
            .addCase(updateSchedule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(updateSchedule.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.schedules.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.schedules[index] = action.payload;
            }
            if (state.selectedSchedule?.id === action.payload.id) {
                state.selectedSchedule = action.payload;
            }
        })
            .addCase(updateSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to update schedule';
        })
            // Delete Schedule
            .addCase(deleteSchedule.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(deleteSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.schedules = state.schedules.filter(s => s.id !== action.payload);
            if (state.selectedSchedule?.id === action.payload) {
                state.selectedSchedule = null;
            }
        })
            .addCase(deleteSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete schedule';
        })
            // Fetch Stats
            .addCase(fetchScheduleStats.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchScheduleStats.fulfilled, (state, action) => {
            state.loading = false;
            state.stats = action.payload;
        })
            .addCase(fetchScheduleStats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch schedule stats';
        })
            // Export Schedules
            .addCase(exportSchedules.pending, state => {
            state.loading = true;
            state.error = null;
        })
            .addCase(exportSchedules.fulfilled, (state, action) => {
            state.loading = false;
            // Handle the response from exporting schedules
        })
            .addCase(exportSchedules.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to export schedules';
        });
    },
});
export const { setFilter, clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
