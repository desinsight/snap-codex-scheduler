import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer, {
  fetchSchedules,
  fetchScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchScheduleStats,
  setFilter,
  clearError,
} from './scheduleSlice';
import { mockSchedule } from '../../utils/testUtils';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { scheduleService } from '../../services/api/schedule.service';

// Mock the scheduleService
jest.mock('../../services/api/schedule.service');

describe('scheduleSlice', () => {
  const store = configureStore({
    reducer: {
      schedules: scheduleReducer,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const newSchedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'> = {
    title: 'Test Schedule',
    description: 'Test Description',
    startDate: new Date(),
    endDate: new Date(),
    category: ScheduleCategory.WORK,
    isShared: false,
    priority: 'medium',
    status: 'pending',
    isAllDay: false,
    createdBy: 'user1',
  };

  it('should handle initial state', () => {
    expect(store.getState().schedules).toEqual({
      schedules: {
        ids: [],
        entities: {},
      },
      currentScheduleId: null,
      loading: false,
      error: null,
      stats: null,
    });
  });

  it('should handle fetchSchedules.fulfilled', async () => {
    await store.dispatch(fetchSchedules());
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle fetchScheduleById.fulfilled', async () => {
    await store.dispatch(fetchScheduleById('1'));
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle createSchedule.fulfilled', async () => {
    await store.dispatch(createSchedule(newSchedule));
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle updateSchedule.fulfilled', async () => {
    await store.dispatch(updateSchedule({ id: '1', schedule: { title: 'Updated Title' } }));
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle deleteSchedule.fulfilled', async () => {
    await store.dispatch(deleteSchedule('1'));
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle fetchScheduleStats.fulfilled', async () => {
    await store.dispatch(fetchScheduleStats());
    const state = store.getState().schedules;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  describe('setFilter', () => {
    it('should update filter state', () => {
      const filter = { category: ScheduleCategory.WORK };
      store.dispatch(setFilter(filter));
      const state = store.getState().schedules;

      expect(state.filter).toEqual(filter);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // First, set an error
      store.dispatch({ type: 'schedules/fetchAll/rejected', error: { message: 'Test error' } });

      // Then, clear it
      store.dispatch(clearError());
      const state = store.getState().schedules;

      expect(state.error).toBeNull();
    });
  });
});
