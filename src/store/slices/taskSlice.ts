import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, Note } from '../../types/models';
import { TaskService } from '../../services/api/task.service';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (projectId?: string) => {
  return await TaskService.getTasks(projectId);
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, status, note }: { taskId: string; status: Task['status']; note?: string }) => {
    return await TaskService.updateTaskStatus(taskId, status, note);
  }
);

export const addTaskNote = createAsyncThunk(
  'tasks/addNote',
  async ({ taskId, note }: { taskId: string; note: Omit<Note, 'noteId' | 'taskId'> }) => {
    return await TaskService.addNote(taskId, note);
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '작업 로드 중 오류가 발생했습니다.';
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.taskId === action.payload.taskId);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.taskId === action.payload.taskId) {
          state.currentTask = action.payload;
        }
      })
      // Add note
      .addCase(addTaskNote.fulfilled, (state, action) => {
        const task = state.tasks.find(t => t.taskId === action.payload.taskId);
        if (task) {
          task.notes.push(action.payload);
        }
        if (state.currentTask?.taskId === action.payload.taskId) {
          state.currentTask.notes.push(action.payload);
        }
      });
  },
});

export const { setCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer;
