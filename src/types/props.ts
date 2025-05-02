import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Schedule, ScheduleCategory, ScheduleStatus } from './schedule';
import { NotificationType, NotificationPriority, NotificationStatus, Notification } from './notification';
import { User } from './auth';

// 공통 컴포넌트 Props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  icon?: ReactNode;
}

export interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  onClose?: () => void;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

// 스케줄 관련 Props
export interface ScheduleFormProps {
  initialData?: Partial<Schedule>;
  onSubmit: (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ScheduleListProps {
  schedules: Schedule[];
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  onSelect?: (schedule: Schedule) => void;
  isLoading?: boolean;
}

export interface ScheduleCalendarProps {
  schedules: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: 'month' | 'week' | 'day') => void;
  view?: 'month' | 'week' | 'day';
}

export interface ScheduleFilterProps {
  onFilterChange: (filters: {
    startDate?: Date;
    endDate?: Date;
    category?: ScheduleCategory;
    status?: ScheduleStatus;
    search?: string;
  }) => void;
  initialFilters?: {
    startDate?: Date;
    endDate?: Date;
    category?: ScheduleCategory;
    status?: ScheduleStatus;
    search?: string;
  };
}

// 알림 관련 Props
export interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  isLoading?: boolean;
}

export interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

export interface NotificationPreferencesProps {
  preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    doNotDisturb: {
      enabled: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
  onPreferencesChange: (preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    doNotDisturb: {
      enabled: boolean;
      startTime?: string;
      endTime?: string;
    };
  }) => void;
}

// 네비게이션 관련 Props
export interface NavigationProps {
  user?: User;
  onLogout?: () => void;
}

export interface NavItemProps {
  icon?: ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

// 분석 관련 Props
export interface AnalyticsDashboardProps {
  data: {
    totalSchedules: number;
    completedSchedules: number;
    upcomingSchedules: number;
    categoryDistribution: Record<ScheduleCategory, number>;
    recentActivity: {
      date: Date;
      count: number;
    }[];
  };
  isLoading?: boolean;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

// 모달 관련 Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

// 폼 관련 Props
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  helpText?: string;
}

export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  error?: string;
} 