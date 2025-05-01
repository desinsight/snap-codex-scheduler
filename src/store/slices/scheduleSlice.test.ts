import { configureStore } from '@reduxjs/toolkit';
import scheduleReducer, {
  fetchSchedules,
  fetchScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  fetchScheduleStats,
  setFilter,
  clearError
} from './scheduleSlice';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { scheduleService } from '../../services/api/schedule.service';

// Mock the scheduleService
jest.mock('../../services/api/schedule.service');

const mockSchedule: Schedule = {
  id: '1',
  title: 'Test Schedule',
  description: 'Test Description',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-02'),
  isAllDay: false,
  category: ScheduleCategory.WORK,
  isShared: false,
  createdBy: 'user1',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('scheduleSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        schedules: scheduleReducer
      }
    });
  });

  describe('fetchSchedules', () => {
    it('should handle fetchSchedules success', async () => {
      const mockSchedules = [mockSchedule];
      (scheduleService.getSchedules as jest.Mock).mockResolvedValue(mockSchedules);

      await store.dispatch(fetchSchedules());
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.schedules).toEqual(mockSchedules);
    });

    it('should handle fetchSchedules failure', async () => {
      const error = new Error('Failed to fetch schedules');
      (scheduleService.getSchedules as jest.Mock).mockRejectedValue(error);

      await store.dispatch(fetchSchedules());
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch schedules');
    });
  });

  describe('fetchScheduleById', () => {
    it('should handle fetchScheduleById success', async () => {
      (scheduleService.getScheduleById as jest.Mock).mockResolvedValue(mockSchedule);

      await store.dispatch(fetchScheduleById('1'));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedSchedule).toEqual(mockSchedule);
    });

    it('should handle fetchScheduleById failure', async () => {
      const error = new Error('Failed to fetch schedule');
      (scheduleService.getScheduleById as jest.Mock).mockRejectedValue(error);

      await store.dispatch(fetchScheduleById('1'));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch schedule');
    });
  });

  describe('createSchedule', () => {
    it('should handle createSchedule success', async () => {
      (scheduleService.createSchedule as jest.Mock).mockResolvedValue(mockSchedule);

      await store.dispatch(createSchedule({
        title: 'Test Schedule',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        isAllDay: false,
        category: ScheduleCategory.WORK,
        isShared: false,
        createdBy: 'user1'
      }));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.schedules).toContainEqual(mockSchedule);
    });

    it('should handle createSchedule failure', async () => {
      const error = new Error('Failed to create schedule');
      (scheduleService.createSchedule as jest.Mock).mockRejectedValue(error);

      await store.dispatch(createSchedule({
        title: 'Test Schedule',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        isAllDay: false,
        category: ScheduleCategory.WORK,
        isShared: false,
        createdBy: 'user1'
      }));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to create schedule');
    });
  });

  describe('updateSchedule', () => {
    it('should handle updateSchedule success', async () => {
      const updatedSchedule = { ...mockSchedule, title: 'Updated Title' };
      (scheduleService.updateSchedule as jest.Mock).mockResolvedValue(updatedSchedule);

      // First, create a schedule
      await store.dispatch(createSchedule(mockSchedule));
      
      // Then, update it
      await store.dispatch(updateSchedule({ id: '1', schedule: { title: 'Updated Title' } }));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.schedules[0].title).toBe('Updated Title');
    });

    it('should handle updateSchedule failure', async () => {
      const error = new Error('Failed to update schedule');
      (scheduleService.updateSchedule as jest.Mock).mockRejectedValue(error);

      await store.dispatch(updateSchedule({ id: '1', schedule: { title: 'Updated Title' } }));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to update schedule');
    });
  });

  describe('deleteSchedule', () => {
    it('should handle deleteSchedule success', async () => {
      (scheduleService.deleteSchedule as jest.Mock).mockResolvedValue(undefined);

      // First, create a schedule
      await store.dispatch(createSchedule(mockSchedule));
      
      // Then, delete it
      await store.dispatch(deleteSchedule('1'));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.schedules).toHaveLength(0);
    });

    it('should handle deleteSchedule failure', async () => {
      const error = new Error('Failed to delete schedule');
      (scheduleService.deleteSchedule as jest.Mock).mockRejectedValue(error);

      await store.dispatch(deleteSchedule('1'));
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to delete schedule');
    });
  });

  describe('fetchScheduleStats', () => {
    it('should handle fetchScheduleStats success', async () => {
      const mockStats = {
        total: 1,
        byCategory: {
          [ScheduleCategory.WORK]: 1,
          [ScheduleCategory.PERSONAL]: 0,
          [ScheduleCategory.EDUCATION]: 0,
          [ScheduleCategory.HEALTH]: 0,
          [ScheduleCategory.OTHER]: 0
        },
        upcoming: 1,
        completed: 0,
        shared: 0
      };
      (scheduleService.getScheduleStats as jest.Mock).mockResolvedValue(mockStats);

      await store.dispatch(fetchScheduleStats());
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.stats).toEqual(mockStats);
    });

    it('should handle fetchScheduleStats failure', async () => {
      const error = new Error('Failed to fetch schedule stats');
      (scheduleService.getScheduleStats as jest.Mock).mockRejectedValue(error);

      await store.dispatch(fetchScheduleStats());
      const state = store.getState().schedules;

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch schedule stats');
    });
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