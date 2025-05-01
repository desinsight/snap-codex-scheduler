import axios from 'axios';
import { TaskService as taskService } from './task.service';
import { mockTask, mockErrorResponse, mockAxios } from '../../utils/testUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Task Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockedAxios, mockAxios);
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const tasks = [mockTask];
      mockedAxios.get.mockResolvedValueOnce({ data: tasks });

      const result = await taskService.getTasks();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/tasks');
      expect(result).toEqual(tasks);
    });

    it('should handle fetch tasks failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.getTasks()).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('getTaskById', () => {
    it('should fetch task by id successfully', async () => {
      const taskId = '1';
      mockedAxios.get.mockResolvedValueOnce({ data: mockTask });

      const result = await taskService.getTaskById(taskId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`/api/tasks/${taskId}`);
      expect(result).toEqual(mockTask);
    });

    it('should handle fetch task by id failure', async () => {
      const taskId = 'invalid-id';
      mockedAxios.get.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.getTaskById(taskId)).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-31',
      };
      mockedAxios.post.mockResolvedValueOnce({ data: mockTask });

      const result = await taskService.createTask(taskData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/tasks', taskData);
      expect(result).toEqual(mockTask);
    });

    it('should handle create task failure', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task Description',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-12-31',
      };
      mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.createTask(taskData)).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = '1';
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
      };
      mockedAxios.put.mockResolvedValueOnce({ data: { ...mockTask, ...updateData } });

      const result = await taskService.updateTask(taskId, updateData);

      expect(mockedAxios.put).toHaveBeenCalledWith(`/api/tasks/${taskId}`, updateData);
      expect(result).toEqual({ ...mockTask, ...updateData });
    });

    it('should handle update task failure', async () => {
      const taskId = '1';
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
      };
      mockedAxios.put.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.updateTask(taskId, updateData)).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = '1';
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await taskService.deleteTask(taskId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`/api/tasks/${taskId}`);
      expect(result).toEqual({ success: true });
    });

    it('should handle delete task failure', async () => {
      const taskId = '1';
      mockedAxios.delete.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.deleteTask(taskId)).rejects.toEqual(mockErrorResponse);
    });
  });

  describe('updateTaskStatus', () => {
    it('should update task status successfully', async () => {
      const taskId = '1';
      const status = 'completed';
      mockedAxios.patch.mockResolvedValueOnce({ data: { ...mockTask, status } });

      const result = await taskService.updateTaskStatus(taskId, status);

      expect(mockedAxios.patch).toHaveBeenCalledWith(`/api/tasks/${taskId}/status`, { status });
      expect(result).toEqual({ ...mockTask, status });
    });

    it('should handle update task status failure', async () => {
      const taskId = '1';
      const status = 'invalid-status';
      mockedAxios.patch.mockRejectedValueOnce(mockErrorResponse);

      await expect(taskService.updateTaskStatus(taskId, status)).rejects.toEqual(mockErrorResponse);
    });
  });
}); 