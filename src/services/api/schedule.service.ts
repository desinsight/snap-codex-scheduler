import axios from 'axios';
import { Schedule, ScheduleFilter, ScheduleStats } from '../../types/schedule';
import { handleApiError } from '../../utils/errorHandling';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export const scheduleService = {
  async getSchedules(filter?: ScheduleFilter): Promise<Schedule[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules`, { params: filter });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getScheduleById(id: string): Promise<Schedule> {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createSchedule(schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Schedule> {
    try {
      const response = await axios.post(`${API_BASE_URL}/schedules`, schedule);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateSchedule(id: string, schedule: Partial<Schedule>): Promise<Schedule> {
    try {
      const response = await axios.put(`${API_BASE_URL}/schedules/${id}`, schedule);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deleteSchedule(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/schedules/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async shareSchedule(id: string, userIds: string[]): Promise<Schedule> {
    try {
      const response = await axios.post(`${API_BASE_URL}/schedules/${id}/share`, { userIds });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getScheduleStats(): Promise<ScheduleStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/stats`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async exportSchedules(format: 'CSV' | 'JSON' = 'JSON'): Promise<Blob> {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async importSchedules(file: File): Promise<Schedule[]> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API_BASE_URL}/schedules/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 