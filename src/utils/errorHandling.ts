import { AxiosError } from 'axios';
import i18n from '../i18n';

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface ErrorResponse {
  message: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
  timestamp?: string;
  userFriendlyMessage: string;
  action?: string;
}

interface ApiErrorResponse {
  message: string;
  details?: Record<string, string[]>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

const getErrorDetails = (error: AxiosError<ApiErrorResponse>): Record<string, string[]> => {
  if (error.response?.data?.details) {
    return error.response.data.details;
  }
  return {};
};

const getUserFriendlyMessage = (error: AxiosError<ApiErrorResponse>): string => {
  if (!error.response) {
    return '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
  }

  const { status, data } = error.response;
  const details = getErrorDetails(error);

  switch (status) {
    case 400:
      if (details.password) {
        return '비밀번호는 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.';
      }
      if (details.email) {
        return '올바른 이메일 형식을 입력해주세요.';
      }
      return data.message || '입력하신 정보를 다시 확인해주세요.';
    case 401:
      return '로그인이 필요합니다. 이메일과 비밀번호를 확인해주세요.';
    case 403:
      return '이 작업을 수행할 권한이 없습니다. 관리자에게 문의해주세요.';
    case 404:
      return '요청하신 페이지를 찾을 수 없습니다.';
    case 409:
      return '이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.';
    case 429:
      return '잠시 후 다시 시도해주세요. 너무 많은 요청을 보내셨습니다.';
    case 500:
      return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    default:
      return '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
};

const getAction = (error: AxiosError): string | undefined => {
  if (!error.response) {
    return '연결 확인';
  }

  switch (error.response.status) {
    case 401:
      return '로그인 페이지로 이동';
    case 403:
      return '홈으로 이동';
    case 404:
      return '이전 페이지로 이동';
    case 429:
      return '30초 후 다시 시도';
    default:
      return undefined;
  }
};

export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response) {
      const data = response.data as ApiError;
      throw new AppError(
        data.message || i18n.t('errors.unknown'),
        data.code || `HTTP_${response.status}`,
        data.details
      );
    }
    if (error.request) {
      throw new AppError(
        i18n.t('errors.networkError'),
        'NETWORK_ERROR'
      );
    }
  }
  
  if (error instanceof Error) {
    throw new AppError(
      error.message,
      'UNKNOWN_ERROR'
    );
  }

  throw new AppError(
    i18n.t('errors.unknown'),
    'UNKNOWN_ERROR'
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return i18n.t('errors.unknown');
}

export function getErrorCode(error: unknown): string {
  if (isAppError(error)) {
    return error.code;
  }
  return 'UNKNOWN_ERROR';
}

export function getErrorDetails(error: unknown): Record<string, any> | undefined {
  if (isAppError(error)) {
    return error.details;
  }
  return undefined;
}

export function formatErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);
  const details = getErrorDetails(error);

  if (details) {
    return `${message} (${code}): ${JSON.stringify(details)}`;
  }
  return `${message} (${code})`;
}
