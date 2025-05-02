import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskService } from '../../services/api/task.service';
import { Task, TaskState, TaskStatus, Note } from '../../types/task';

const initialState: TaskState = {
  tasks: {
    ids: [],
    entities: {
      tasks: {},
      notes: {}
    }
  },
  currentTaskId: null,
  loading: false,
  error: null
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await TaskService.getTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (taskId: string) => {
    return await TaskService.getTaskById(taskId);
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status, note }: { id: string; status: TaskStatus; note?: string }) => {
    return await TaskService.updateTaskStatuses([{ id, status, note }]);
  }
);

export const addTaskNote = createAsyncThunk(
  'tasks/addNote',
  async ({ id, note }: { id: string; note: string }) => {
    return await TaskService.addTaskNote(id, note);
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTaskId = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTaskId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const task = action.payload;
          state.tasks.entities.tasks[task.id] = task;
          if (!state.tasks.ids.includes(task.id)) {
            state.tasks.ids.push(task.id);
          }
        }
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch task';
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const [task] = action.payload;
        if (task) {
          state.tasks.entities.tasks[task.id] = task;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update task status';
      })
      .addCase(addTaskNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskNote.fulfilled, (state, action) => {
        state.loading = false;
        const { id, note } = action.payload;
        if (note) {
          state.tasks.entities.notes[note.id] = note;
          const task = state.tasks.entities.tasks[id];
          if (task) {
            task.notes = task.notes || [];
            task.notes.push(note.id);
          }
        }
      })
      .addCase(addTaskNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add note';
      });
  }
});

export const { setCurrentTask, clearCurrentTask } = taskSlice.actions;

export const selectAllTasks = (state: { tasks: TaskState }) => 
  state.tasks.tasks.ids.map(id => state.tasks.tasks.entities.tasks[id]);

export const selectTaskById = (state: { tasks: TaskState }, taskId: string) =>
  state.tasks.tasks.entities.tasks[taskId];

export const selectTaskNotes = (state: { tasks: TaskState }, id: string) => {
  const task = selectTaskById(state, id);
  return task?.notes?.map(noteId => state.tasks.tasks.entities.notes[noteId]) || [];
};

export default taskSlice.reducer;
