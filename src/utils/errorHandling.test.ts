import { AxiosError } from 'axios';
import { handleApiError, formatErrorMessage } from './errorHandling';

describe('Error Handling', () => {
  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const error = new Error('Network Error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
        code: 'NETWORK_ERROR',
      });
    });

    it('should handle 401 unauthorized errors', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Invalid token' },
        },
      };
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        code: 'UNAUTHORIZED',
      });
    });

    it('should handle 403 forbidden errors', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Access denied' },
        },
      };
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '접근 권한이 없습니다.',
        code: 'FORBIDDEN',
      });
    });

    it('should handle 404 not found errors', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Resource not found' },
        },
      };
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '요청하신 리소스를 찾을 수 없습니다.',
        code: 'NOT_FOUND',
      });
    });

    it('should handle 500 server errors', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      };
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        code: 'SERVER_ERROR',
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '알 수 없는 오류가 발생했습니다.',
        code: 'UNKNOWN_ERROR',
      });
    });

    it('AxiosError를 올바르게 처리한다', () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        data: { message: '잘못된 요청입니다' },
      } as any;

      expect(handleApiError(error)).toBe('잘못된 요청입니다');
    });

    it('각 HTTP 상태 코드에 대해 적절한 메시지를 반환한다', () => {
      const testCases = [
        { status: 401, expected: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 403, expected: '접근 권한이 없습니다' },
        { status: 404, expected: '요청한 리소스를 찾을 수 없습니다' },
        { status: 409, expected: '이미 사용 중인 이메일입니다' },
        { status: 429, expected: '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요' },
        { status: 500, expected: '서버 오류가 발생했습니다' },
      ];

      testCases.forEach(({ status, expected }) => {
        const error = new AxiosError();
        error.response = { status, data: {} } as any;
        expect(handleApiError(error)).toBe(expected);
      });
    });

    it('request 오류를 처리한다', () => {
      const error = new AxiosError();
      error.request = {};
      expect(handleApiError(error)).toBe('서버에 연결할 수 없습니다');
    });

    it('일반 Error를 처리한다', () => {
      const error = new Error('테스트 에러');
      expect(handleApiError(error)).toBe('테스트 에러');
    });
  });

  describe('formatErrorMessage', () => {
    it('should format validation errors', () => {
      const errors = {
        email: ['이메일 형식이 올바르지 않습니다'],
        password: ['비밀번호는 8자 이상이어야 합니다'],
      };
      const result = formatErrorMessage(errors);
      
      expect(result).toBe('이메일: 이메일 형식이 올바르지 않습니다\n비밀번호: 비밀번호는 8자 이상이어야 합니다');
    });

    it('should handle single error message', () => {
      const error = 'Invalid credentials';
      const result = formatErrorMessage(error);
      
      expect(result).toBe('Invalid credentials');
    });

    it('should handle empty errors', () => {
      const result = formatErrorMessage({});
      
      expect(result).toBe('알 수 없는 오류가 발생했습니다.');
    });

    it('should handle null or undefined errors', () => {
      expect(formatErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다.');
      expect(formatErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다.');
    });

    it('문자열 에러를 처리한다', () => {
      expect(formatErrorMessage('테스트 에러')).toBe('테스트 에러');
    });

    it('validation 에러 객체를 처리한다', () => {
      const error = {
        errors: {
          email: ['이메일이 필요합니다'],
          password: ['비밀번호가 필요합니다'],
        },
      };
      expect(formatErrorMessage(error)).toBe('email: 이메일이 필요합니다\npassword: 비밀번호가 필요합니다');
    });

    it('message 속성이 있는 객체를 처리한다', () => {
      const error = { message: '테스트 에러' };
      expect(formatErrorMessage(error)).toBe('테스트 에러');
    });
  });
}); 