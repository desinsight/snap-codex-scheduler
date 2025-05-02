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
  code: string;
  details?: Record<string, string[]>;
}

interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

class AppError extends Error {
  code: string;
  details?: Record<string, string[]>;

  constructor(message: string, code: string, details?: Record<string, string[]>) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export function getErrorDetails(error: unknown): Record<string, string[]> | undefined {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    return response?.details;
  }
  if (error instanceof AppError) {
    return error.details;
  }
  return undefined;
}

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    const details = response?.details;

    if (details?.password) {
      return i18n.t('errors.password');
    }
    if (details?.email) {
      return i18n.t('errors.email');
    }

    return response?.message || i18n.t('errors.networkError');
  }

  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return i18n.t('errors.unknown');
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    return response?.code || `HTTP_${error.response?.status || 'UNKNOWN'}`;
  }

  if (error instanceof AppError) {
    return error.code;
  }

  return 'UNKNOWN_ERROR';
}

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

export function formatErrorMessage(error: unknown): string {
  const message = getErrorMessage(error);
  const code = getErrorCode(error);
  const details = getErrorDetails(error);

  if (details) {
    return `${message} (${code}): ${JSON.stringify(details)}`;
  }
  return `${message} (${code})`;
}
