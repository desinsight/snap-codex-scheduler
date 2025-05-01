import { AxiosError } from 'axios';

<<<<<<< HEAD
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  message: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
  timestamp?: string;
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

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { status, data } = error.response;
      const details = getErrorDetails(error);

      return {
        message: data.message || '알 수 없는 오류가 발생했습니다',
        code: getErrorCode(status),
        details,
        timestamp: new Date().toISOString(),
        userFriendlyMessage: getUserFriendlyMessage(error),
        action: getAction(error)
      };
    } else if (error.request) {
      return {
        message: 'Network Error',
        code: ErrorCode.NETWORK_ERROR,
        timestamp: new Date().toISOString(),
        userFriendlyMessage: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        action: '연결 확인'
      };
    }
  } else if (error instanceof Error) {
    return {
      message: error.message,
      code: ErrorCode.UNKNOWN_ERROR,
      timestamp: new Date().toISOString(),
      userFriendlyMessage: error.message
    };
  }

  return {
    message: '알 수 없는 오류가 발생했습니다',
    code: ErrorCode.UNKNOWN_ERROR,
    timestamp: new Date().toISOString(),
    userFriendlyMessage: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  };
};

const getErrorCode = (status: number): ErrorCode => {
  switch (status) {
    case 400:
      return ErrorCode.VALIDATION_ERROR;
    case 401:
      return ErrorCode.AUTHENTICATION_ERROR;
    case 403:
      return ErrorCode.AUTHORIZATION_ERROR;
    case 404:
      return ErrorCode.RESOURCE_NOT_FOUND;
    case 409:
      return ErrorCode.CONFLICT_ERROR;
    case 429:
      return ErrorCode.RATE_LIMIT_ERROR;
    case 500:
      return ErrorCode.SERVER_ERROR;
    default:
      return ErrorCode.UNKNOWN_ERROR;
  }
};

export const formatErrorMessage = (error: unknown): string => {
=======
interface ApiError {
  message: string;
  code?: string;
}

export const handleApiError = (error: unknown): string => {
  // 기본 에러 메시지
  let errorMessage = '알 수 없는 오류가 발생했습니다';

  // Axios 에러인 경우
  if (error instanceof AxiosError) {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      switch (status) {
        case 400:
          errorMessage = (data as ApiError).message || '잘못된 요청입니다';
          break;
        case 401:
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다';
          break;
        case 403:
          errorMessage = '접근 권한이 없습니다';
          break;
        case 404:
          errorMessage = '요청한 리소스를 찾을 수 없습니다';
          break;
        case 409:
          errorMessage = '이미 사용 중인 이메일입니다';
          break;
        case 429:
          errorMessage = '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다';
          break;
        default:
          errorMessage = '알 수 없는 오류가 발생했습니다';
      }
    } else if (error.request) {
      errorMessage = '서버에 연결할 수 없습니다';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
};

export const formatErrorMessage = (error: any): string => {
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  if (!error) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (typeof error === 'string') {
    return error;
  }

<<<<<<< HEAD
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    return handleApiError(error).userFriendlyMessage;
=======
  if (typeof error === 'object') {
    // Handle validation errors
    if (error.errors) {
      return Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
        .join('\n');
    }

    // Handle error with message
    if (error.message) {
      return error.message;
    }
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
  }

  return '알 수 없는 오류가 발생했습니다.';
}; 