import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import notificationReducer from './slices/notificationSlice';
const store = configureStore({
    reducer: {
        tasks: taskReducer,
        auth: authReducer,
        schedules: scheduleReducer,
        notifications: notificationReducer,
        // 추후 다른 리듀서들 추가 예정
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            // Date 객체 직렬화 이슈 해결을 위한 설정
            ignoredActions: ['tasks/fetchTasks/fulfilled'],
            ignoredPaths: ['tasks.tasks.*.taskDate', 'tasks.currentTask.taskDate'],
        },
    }),
});
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export default store;
