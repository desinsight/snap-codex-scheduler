import { ChangeEvent, FocusEvent, FormEvent, KeyboardEvent, MouseEvent, SyntheticEvent } from 'react';
import { Schedule } from './schedule';
import { Notification } from './notification';
import { User } from './auth';

// 기본 이벤트 핸들러 타입
export type ChangeEventHandler<T = HTMLInputElement> = (event: ChangeEvent<T>) => void;
export type FocusEventHandler<T = HTMLElement> = (event: FocusEvent<T>) => void;
export type FormEventHandler<T = HTMLFormElement> = (event: FormEvent<T>) => void;
export type KeyboardEventHandler<T = HTMLElement> = (event: KeyboardEvent<T>) => void;
export type MouseEventHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;
export type SyntheticEventHandler<T = HTMLElement> = (event: SyntheticEvent<T>) => void;

// 스케줄 관련 이벤트 핸들러
export type ScheduleEventHandler = (schedule: Schedule) => void;
export type ScheduleListEventHandler = (schedules: Schedule[]) => void;
export type ScheduleDateEventHandler = (date: Date) => void;
export type ScheduleRangeEventHandler = (start: Date, end: Date) => void;
export type ScheduleFilterEventHandler = (filters: {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  status?: string;
  search?: string;
}) => void;

// 알림 관련 이벤트 핸들러
export type NotificationEventHandler = (notification: Notification) => void;
export type NotificationListEventHandler = (notifications: Notification[]) => void;
export type NotificationFilterEventHandler = (filters: {
  type?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) => void;
export type NotificationPreferenceEventHandler = (preferences: {
  email: boolean;
  push: boolean;
  sms: boolean;
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
}) => void;

// 사용자 관련 이벤트 핸들러
export type UserEventHandler = (user: User) => void;
export type UserListEventHandler = (users: User[]) => void;
export type UserAuthEventHandler = (credentials: {
  email: string;
  password: string;
}) => void;
export type UserPreferenceEventHandler = (preferences: {
  theme: string;
  language: string;
  timezone: string;
}) => void;

// 캘린더 관련 이벤트 핸들러
export type CalendarViewChangeEventHandler = (view: 'month' | 'week' | 'day') => void;
export type CalendarDateSelectEventHandler = (date: Date) => void;
export type CalendarRangeSelectEventHandler = (start: Date, end: Date) => void;
export type CalendarEventClickEventHandler = (event: Schedule) => void;
export type CalendarEventDropEventHandler = (event: Schedule, start: Date, end: Date) => void;
export type CalendarEventResizeEventHandler = (event: Schedule, start: Date, end: Date) => void;

// 모달 관련 이벤트 핸들러
export type ModalOpenEventHandler = (type: string, data?: any) => void;
export type ModalCloseEventHandler = () => void;
export type ModalSubmitEventHandler = (data: any) => void;

// 토스트 관련 이벤트 핸들러
export type ToastShowEventHandler = (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
export type ToastHideEventHandler = () => void;

// 드래그 앤 드롭 관련 이벤트 핸들러
export type DragStartEventHandler<T = any> = (item: T) => void;
export type DragEndEventHandler<T = any> = (item: T) => void;
export type DropEventHandler<T = any> = (item: T) => void;

// 검색 관련 이벤트 핸들러
export type SearchEventHandler = (query: string) => void;
export type SearchSubmitEventHandler = (query: string) => void;
export type SearchClearEventHandler = () => void;

// 필터 관련 이벤트 핸들러
export type FilterChangeEventHandler<T = any> = (filters: T) => void;
export type FilterResetEventHandler = () => void;

// 정렬 관련 이벤트 핸들러
export type SortChangeEventHandler<T = any> = (sort: {
  field: keyof T;
  direction: 'asc' | 'desc';
}) => void;

// 페이지네이션 관련 이벤트 핸들러
export type PageChangeEventHandler = (page: number) => void;
export type PageSizeChangeEventHandler = (pageSize: number) => void;

// 폼 관련 이벤트 핸들러
export type FormSubmitEventHandler<T = any> = (data: T) => void;
export type FormResetEventHandler = () => void;
export type FormValidationEventHandler = (errors: Record<string, string>) => void;

// 파일 업로드 관련 이벤트 핸들러
export type FileSelectEventHandler = (files: FileList) => void;
export type FileUploadEventHandler = (file: File) => void;
export type FileUploadProgressEventHandler = (progress: number) => void;
export type FileUploadCompleteEventHandler = (url: string) => void;
export type FileUploadErrorEventHandler = (error: Error) => void;

// 키보드 단축키 관련 이벤트 핸들러
export type KeyboardShortcutEventHandler = (key: string, event: KeyboardEvent) => void;

// 리사이즈 관련 이벤트 핸들러
export type ResizeEventHandler = (width: number, height: number) => void;

// 스크롤 관련 이벤트 핸들러
export type ScrollEventHandler = (scrollTop: number, scrollLeft: number) => void;

// 터치 관련 이벤트 핸들러
export type TouchStartEventHandler = (event: TouchEvent) => void;
export type TouchMoveEventHandler = (event: TouchEvent) => void;
export type TouchEndEventHandler = (event: TouchEvent) => void;

// 애니메이션 관련 이벤트 핸들러
export type AnimationStartEventHandler = () => void;
export type AnimationEndEventHandler = () => void;
export type AnimationIterationEventHandler = () => void; 