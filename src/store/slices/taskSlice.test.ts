import { configureStore } from '@reduxjs/toolkit';
import taskReducer, {
  fetchTasks,
  fetchTaskById,
  updateTaskStatus,
  addTaskNote,
  selectAllTasks,
  selectTaskById,
  selectTaskNotes,
} from './taskSlice';
import { mockTask } from '../../utils/testUtils';
import { TaskStatus } from '../../types/task';

describe('taskSlice', () => {
  const store = configureStore({
    reducer: {
      tasks: taskReducer,
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(store.getState().tasks).toEqual({
      tasks: {
        ids: [],
        entities: {
          tasks: {},
          notes: {},
        },
      },
      currentTaskId: null,
      loading: false,
      error: null,
    });
  });

  it('should handle fetchTasks.fulfilled', async () => {
    const tasks = [mockTask];
    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle updateTaskStatus.fulfilled', async () => {
    await store.dispatch(
      updateTaskStatus({
        id: '1',
        status: TaskStatus.COMPLETED,
        note: 'Task completed',
      })
    );
    const state = store.getState().tasks;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle addTaskNote.fulfilled', async () => {
    await store.dispatch(
      addTaskNote({
        id: '1',
        note: 'Test note',
      })
    );
    const state = store.getState().tasks;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should select all tasks', () => {
    const tasks = selectAllTasks(store.getState());
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should select task by id', () => {
    const task = selectTaskById(store.getState(), '1');
    expect(task).toBeDefined();
  });

  it('should select task notes', () => {
    const notes = selectTaskNotes(store.getState(), '1');
    expect(Array.isArray(notes)).toBe(true);
  });
}); 