import { AxiosError } from 'axios';

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
  if (!error) {
    return '알 수 없는 오류가 발생했습니다.';
  }

  if (typeof error === 'string') {
    return error;
  }

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
  }

  return '알 수 없는 오류가 발생했습니다.';
}; 