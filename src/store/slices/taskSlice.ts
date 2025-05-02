import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, Note } from '../../types/models';
import { TaskService } from '../../services/api/task.service';

// 상태 정규화
interface NormalizedTaskState {
  entities: {
    tasks: Record<string, Task>;
    notes: Record<string, Note>;
  };
  ids: string[];
  currentTaskId: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

const initialState: NormalizedTaskState = {
  entities: {
    tasks: {},
    notes: {}
  },
  ids: [],
  currentTaskId: null,
  loading: false,
  error: null,
  lastUpdated: 0
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (projectId?: string, { getState }) => {
    const state = getState() as { tasks: NormalizedTaskState };
    const forceRefresh = Date.now() - state.tasks.lastUpdated > 5 * 60 * 1000;
    return await TaskService.getTasks(projectId, forceRefresh);
  }
);

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
      state.currentTaskId = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    // 낙관적 업데이트를 위한 리듀서
    optimisticUpdate: (state, action) => {
      const { taskId, status } = action.payload;
      if (state.entities.tasks[taskId]) {
        state.entities.tasks[taskId].status = status;
      }
    },
    // 롤백을 위한 리듀서
    rollbackUpdate: (state, action) => {
      const { taskId, previousStatus } = action.payload;
      if (state.entities.tasks[taskId]) {
        state.entities.tasks[taskId].status = previousStatus;
      }
    }
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
        state.lastUpdated = Date.now();
        
        // 상태 정규화
        action.payload.forEach(task => {
          state.entities.tasks[task.taskId] = task;
          if (!state.ids.includes(task.taskId)) {
            state.ids.push(task.taskId);
          }
          
          // 노트 정규화
          task.notes?.forEach(note => {
            state.entities.notes[note.noteId] = note;
          });
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '작업 로드 중 오류가 발생했습니다.';
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = action.payload;
        state.entities.tasks[task.taskId] = task;
        if (state.currentTaskId === task.taskId) {
          state.currentTaskId = task.taskId;
        }
      })
      // Add note
      .addCase(addTaskNote.fulfilled, (state, action) => {
        const note = action.payload;
        state.entities.notes[note.noteId] = note;
        const task = state.entities.tasks[note.taskId];
        if (task) {
          task.notes = task.notes || [];
          task.notes.push(note);
        }
      });
  },
});

// 셀렉터
export const selectAllTasks = (state: { tasks: NormalizedTaskState }) => 
  state.tasks.ids.map(id => state.tasks.entities.tasks[id]);

export const selectTaskById = (taskId: string) => (state: { tasks: NormalizedTaskState }) => 
  state.tasks.entities.tasks[taskId];

export const selectCurrentTask = (state: { tasks: NormalizedTaskState }) => 
  state.tasks.currentTaskId ? state.tasks.entities.tasks[state.tasks.currentTaskId] : null;

export const selectTaskNotes = (taskId: string) => (state: { tasks: NormalizedTaskState }) => {
  const task = state.tasks.entities.tasks[taskId];
  return task?.notes?.map(noteId => state.tasks.entities.notes[noteId]) || [];
};

export const { setCurrentTask, clearError, optimisticUpdate, rollbackUpdate } = taskSlice.actions;
export default taskSlice.reducer;
