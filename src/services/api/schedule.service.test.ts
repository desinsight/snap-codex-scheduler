import axios from 'axios';
import { scheduleService } from './schedule.service';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { handleApiError } from '../../utils/errorHandling';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock handleApiError
jest.mock('../../utils/errorHandling', () => ({
  handleApiError: jest.fn(),
}));

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
  updatedAt: new Date(),
};

describe('scheduleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSchedules', () => {
    it('should fetch schedules successfully', async () => {
      const mockSchedules = [mockSchedule];
      mockedAxios.get.mockResolvedValue({ data: mockSchedules });

      const result = await scheduleService.getSchedules();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/schedules', {
        params: undefined,
      });
      expect(result).toEqual(mockSchedules);
    });

    it('should handle error when fetching schedules', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.getSchedules()).rejects.toThrow('API Error');
    });
  });

  describe('getScheduleById', () => {
    it('should fetch a schedule by id successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockSchedule });

      const result = await scheduleService.getScheduleById('1');

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/schedules/1');
      expect(result).toEqual(mockSchedule);
    });

    it('should handle error when fetching a schedule by id', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.getScheduleById('1')).rejects.toThrow('API Error');
    });
  });

  describe('createSchedule', () => {
    it('should create a schedule successfully', async () => {
      const newSchedule = {
        title: 'New Schedule',
        description: 'New Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        isAllDay: false,
        category: ScheduleCategory.WORK,
        isShared: false,
        createdBy: 'user1',
      };
      mockedAxios.post.mockResolvedValue({ data: mockSchedule });

      const result = await scheduleService.createSchedule(newSchedule);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/schedules',
        newSchedule
      );
      expect(result).toEqual(mockSchedule);
    });

    it('should handle error when creating a schedule', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.createSchedule(mockSchedule)).rejects.toThrow('API Error');
    });
  });

  describe('updateSchedule', () => {
    it('should update a schedule successfully', async () => {
      const updatedSchedule = { ...mockSchedule, title: 'Updated Title' };
      mockedAxios.put.mockResolvedValue({ data: updatedSchedule });

      const result = await scheduleService.updateSchedule('1', { title: 'Updated Title' });

      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:3000/api/schedules/1', {
        title: 'Updated Title',
      });
      expect(result).toEqual(updatedSchedule);
    });

    it('should handle error when updating a schedule', async () => {
      const error = new Error('Network error');
      mockedAxios.put.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.updateSchedule('1', { title: 'Updated Title' })).rejects.toThrow(
        'API Error'
      );
    });
  });

  describe('deleteSchedule', () => {
    it('should delete a schedule successfully', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await scheduleService.deleteSchedule('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3000/api/schedules/1');
    });

    it('should handle error when deleting a schedule', async () => {
      const error = new Error('Network error');
      mockedAxios.delete.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.deleteSchedule('1')).rejects.toThrow('API Error');
    });
  });

  describe('shareSchedule', () => {
    it('should share a schedule successfully', async () => {
      const sharedSchedule = { ...mockSchedule, isShared: true, sharedWith: ['user2'] };
      mockedAxios.post.mockResolvedValue({ data: sharedSchedule });

      const result = await scheduleService.shareSchedule('1', ['user2']);

      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3000/api/schedules/1/share', {
        userIds: ['user2'],
      });
      expect(result).toEqual(sharedSchedule);
    });

    it('should handle error when sharing a schedule', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.shareSchedule('1', ['user2'])).rejects.toThrow('API Error');
    });
  });

  describe('getScheduleStats', () => {
    it('should fetch schedule stats successfully', async () => {
      const mockStats = {
        total: 1,
        byCategory: {
          [ScheduleCategory.WORK]: 1,
          [ScheduleCategory.PERSONAL]: 0,
          [ScheduleCategory.EDUCATION]: 0,
          [ScheduleCategory.HEALTH]: 0,
          [ScheduleCategory.OTHER]: 0,
        },
        upcoming: 1,
        completed: 0,
        shared: 0,
      };
      mockedAxios.get.mockResolvedValue({ data: mockStats });

      const result = await scheduleService.getScheduleStats();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/schedules/stats');
      expect(result).toEqual(mockStats);
    });

    it('should handle error when fetching schedule stats', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.getScheduleStats()).rejects.toThrow('API Error');
    });
  });

  describe('exportSchedules', () => {
    it('should export schedules successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/json' });
      mockedAxios.get.mockResolvedValue({ data: mockBlob });

      const result = await scheduleService.exportSchedules();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:3000/api/schedules/export', {
        params: { format: 'JSON' },
        responseType: 'blob',
      });
      expect(result).toEqual(mockBlob);
    });

    it('should handle error when exporting schedules', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.exportSchedules()).rejects.toThrow('API Error');
    });
  });

  describe('importSchedules', () => {
    it('should import schedules successfully', async () => {
      const mockFile = new File(['test'], 'test.json', { type: 'application/json' });
      const mockSchedules = [mockSchedule];
      mockedAxios.post.mockResolvedValue({ data: mockSchedules });

      const result = await scheduleService.importSchedules(mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/schedules/import',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockSchedules);
    });

    it('should handle error when importing schedules', async () => {
      const mockFile = new File(['test'], 'test.json', { type: 'application/json' });
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValue(error);
      (handleApiError as jest.Mock).mockImplementation(() => {
        throw new Error('API Error');
      });

      await expect(scheduleService.importSchedules(mockFile)).rejects.toThrow('API Error');
    });
  });
});
