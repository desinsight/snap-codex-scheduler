import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
    // 추후 다른 리듀서들 추가 예정
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Date 객체 직렬화 이슈 해결을 위한 설정
        ignoredActions: ['tasks/fetchTasks/fulfilled'],
        ignoredPaths: ['tasks.tasks.*.taskDate', 'tasks.currentTask.taskDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
