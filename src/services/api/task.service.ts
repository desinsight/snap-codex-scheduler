import axios from 'axios';
import { Task, Note } from '../../types/models';
import { Status } from '../../types/common';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const TaskService = {
  // Task CRUD operations
  getTasks: async (projectId?: string): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}/tasks`, { params: { projectId } });
    return response.data;
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await axios.get(`${API_URL}/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (task: Omit<Task, 'taskId' | 'notes'>): Promise<Task> => {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  },

  updateTask: async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
  },

  updateTaskStatus: async (taskId: string, status: Status, note?: string): Promise<Task> => {
    const response = await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status, note });
    return response.data;
  },

  // Notes operations
  addNote: async (taskId: string, note: Omit<Note, 'noteId' | 'taskId'>): Promise<Note> => {
    const response = await axios.post<Note>(`${API_URL}/tasks/${taskId}/notes`, note);
    return response.data;
  },

  getNotes: async (taskId: string): Promise<Note[]> => {
    const response = await axios.get<Note[]>(`${API_URL}/tasks/${taskId}/notes`);
    return response.data;
  },

  // Calendar operations
  syncWithGoogle: async (taskId: string): Promise<void> => {
    await axios.post(`${API_URL}/calendar/google/sync/${taskId}`);
  },

  exportToApple: async (taskId: string): Promise<void> => {
    await axios.get(`${API_URL}/calendar/apple/export/${taskId}`);
  },

  // Excel operations
  importFromExcel: async (file: File): Promise<Task[]> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post<Task[]>(`${API_URL}/import/excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  exportToExcel: async (projectId?: string): Promise<Blob> => {
    const response = await axios.get(`${API_URL}/export/excel`, {
      params: { projectId },
      responseType: 'blob',
    });
    return response.data;
  },
};
