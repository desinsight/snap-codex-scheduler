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
  code: ErrorCode;
  details?: Record<string, string[]>;
}

export interface ErrorResponse {
  message: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string[];
}

export interface ErrorState {
  message: string | null;
  code: ErrorCode | null;
  details?: Record<string, string[]>;
  isError: boolean;
} 