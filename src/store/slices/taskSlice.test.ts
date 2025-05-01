import { taskSlice, TaskState } from './taskSlice';
import { mockTask } from '../../utils/testUtils';

describe('Task Slice', () => {
  const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    currentTask: null,
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(taskSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('fetchTasks', () => {
      it('should handle fetchTasks.pending', () => {
        const action = { type: 'tasks/fetchTasks/pending' };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null,
        });
      });

      it('should handle fetchTasks.fulfilled', () => {
        const tasks = [mockTask];
        const action = {
          type: 'tasks/fetchTasks/fulfilled',
          payload: tasks,
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          tasks,
          loading: false,
        });
      });

      it('should handle fetchTasks.rejected', () => {
        const error = 'Failed to fetch tasks';
        const action = {
          type: 'tasks/fetchTasks/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error,
        });
      });
    });

    describe('fetchTaskById', () => {
      it('should handle fetchTaskById.pending', () => {
        const action = { type: 'tasks/fetchTaskById/pending' };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null,
        });
      });

      it('should handle fetchTaskById.fulfilled', () => {
        const action = {
          type: 'tasks/fetchTaskById/fulfilled',
          payload: mockTask,
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          currentTask: mockTask,
          loading: false,
        });
      });

      it('should handle fetchTaskById.rejected', () => {
        const error = 'Failed to fetch task';
        const action = {
          type: 'tasks/fetchTaskById/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error,
        });
      });
    });

    describe('createTask', () => {
      it('should handle createTask.pending', () => {
        const action = { type: 'tasks/createTask/pending' };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: true,
          error: null,
        });
      });

      it('should handle createTask.fulfilled', () => {
        const action = {
          type: 'tasks/createTask/fulfilled',
          payload: mockTask,
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          tasks: [mockTask],
          loading: false,
        });
      });

      it('should handle createTask.rejected', () => {
        const error = 'Failed to create task';
        const action = {
          type: 'tasks/createTask/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(initialState, action);
        expect(state).toEqual({
          ...initialState,
          loading: false,
          error,
        });
      });
    });

    describe('updateTask', () => {
      const existingState = {
        ...initialState,
        tasks: [mockTask],
      };

      it('should handle updateTask.pending', () => {
        const action = { type: 'tasks/updateTask/pending' };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: true,
          error: null,
        });
      });

      it('should handle updateTask.fulfilled', () => {
        const updatedTask = { ...mockTask, title: 'Updated Task' };
        const action = {
          type: 'tasks/updateTask/fulfilled',
          payload: updatedTask,
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          tasks: [updatedTask],
          loading: false,
        });
      });

      it('should handle updateTask.rejected', () => {
        const error = 'Failed to update task';
        const action = {
          type: 'tasks/updateTask/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: false,
          error,
        });
      });
    });

    describe('deleteTask', () => {
      const existingState = {
        ...initialState,
        tasks: [mockTask],
      };

      it('should handle deleteTask.pending', () => {
        const action = { type: 'tasks/deleteTask/pending' };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: true,
          error: null,
        });
      });

      it('should handle deleteTask.fulfilled', () => {
        const action = {
          type: 'tasks/deleteTask/fulfilled',
          payload: mockTask.id,
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          tasks: [],
          loading: false,
        });
      });

      it('should handle deleteTask.rejected', () => {
        const error = 'Failed to delete task';
        const action = {
          type: 'tasks/deleteTask/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: false,
          error,
        });
      });
    });

    describe('updateTaskStatus', () => {
      const existingState = {
        ...initialState,
        tasks: [mockTask],
      };

      it('should handle updateTaskStatus.pending', () => {
        const action = { type: 'tasks/updateTaskStatus/pending' };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: true,
          error: null,
        });
      });

      it('should handle updateTaskStatus.fulfilled', () => {
        const updatedTask = { ...mockTask, status: 'completed' };
        const action = {
          type: 'tasks/updateTaskStatus/fulfilled',
          payload: updatedTask,
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          tasks: [updatedTask],
          loading: false,
        });
      });

      it('should handle updateTaskStatus.rejected', () => {
        const error = 'Failed to update task status';
        const action = {
          type: 'tasks/updateTaskStatus/rejected',
          error: { message: error },
        };
        const state = taskSlice.reducer(existingState, action);
        expect(state).toEqual({
          ...existingState,
          loading: false,
          error,
        });
      });
    });
  });
}); 