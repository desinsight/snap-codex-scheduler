import { Schedule, ScheduleCategory, ScheduleStatus } from './schedule';
import { User, UserRole } from './auth';
import { Notification, NotificationType, NotificationStatus } from './notification';
import { ApiError } from './api';

// 공통 상태 인터페이스
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// 인증 상태
export interface AuthState extends LoadingState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

// 스케줄 상태
export interface ScheduleState extends LoadingState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  filters: {
    startDate?: Date;
    endDate?: Date;
    category?: ScheduleCategory;
    status?: ScheduleStatus;
    search?: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
}

// 알림 상태
export interface NotificationState extends LoadingState {
  notifications: Notification[];
  unreadCount: number;
  filters: {
    type?: NotificationType;
    status?: NotificationStatus;
    startDate?: Date;
    endDate?: Date;
  };
  preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    doNotDisturb: {
      enabled: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
}

// UI 상태
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  sidebarOpen: boolean;
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
  toast: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  };
}

// 설정 상태
export interface SettingsState extends LoadingState {
  userPreferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    display: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      timezone: string;
    };
    security: {
      twoFactorEnabled: boolean;
      lastPasswordChange: string;
    };
  };
  systemSettings: {
    maintenanceMode: boolean;
    version: string;
    environment: string;
  };
}

// Redux Root State
export interface RootState {
  auth: AuthState;
  schedule: ScheduleState;
  notification: NotificationState;
  ui: UIState;
  settings: SettingsState;
}

// Redux Action Types
export type Action<T = any> = {
  type: string;
  payload?: T;
  error?: ApiError;
};

// Redux Action Creators
export interface ActionCreators {
  // Auth Actions
  login: (credentials: { email: string; password: string }) => Action;
  logout: () => Action;
  refreshToken: () => Action;
  
  // Schedule Actions
  fetchSchedules: (filters?: ScheduleState['filters']) => Action;
  createSchedule: (schedule: Omit<Schedule, 'id'>) => Action;
  updateSchedule: (schedule: Schedule) => Action;
  deleteSchedule: (id: string) => Action;
  
  // Notification Actions
  fetchNotifications: () => Action;
  markAsRead: (id: string) => Action;
  markAllAsRead: () => Action;
  updatePreferences: (preferences: NotificationState['preferences']) => Action;
  
  // UI Actions
  toggleTheme: () => Action;
  setLanguage: (language: string) => Action;
  setTimezone: (timezone: string) => Action;
  toggleSidebar: () => Action;
  showModal: (type: string, data?: any) => Action;
  hideModal: () => Action;
  showToast: (message: string, type: UIState['toast']['type']) => Action;
  hideToast: () => Action;
  
  // Settings Actions
  updateUserPreferences: (preferences: SettingsState['userPreferences']) => Action;
  updateSystemSettings: (settings: SettingsState['systemSettings']) => Action;
}

// Context API Types
export interface AppContextType {
  state: RootState;
  dispatch: React.Dispatch<Action>;
  actions: ActionCreators;
}

// Redux Middleware Types
export interface MiddlewareAPI {
  dispatch: React.Dispatch<Action>;
  getState: () => RootState;
}

export type Middleware = (api: MiddlewareAPI) => (next: React.Dispatch<Action>) => (action: Action) => void;

// Redux Reducer Types
export type Reducer<S = any, A = Action> = (state: S, action: A) => S;

// Redux Store Types
export interface Store {
  dispatch: React.Dispatch<Action>;
  getState: () => RootState;
  subscribe: (listener: () => void) => () => void;
  replaceReducer: (nextReducer: Reducer) => void;
} 