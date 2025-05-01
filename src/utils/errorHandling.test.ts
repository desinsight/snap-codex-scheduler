import { AxiosError } from 'axios';
<<<<<<< HEAD
import { handleApiError, formatErrorMessage, ErrorCode } from './errorHandling';
=======
import { handleApiError, formatErrorMessage } from './errorHandling';
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221

describe('Error Handling', () => {
  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const error = new Error('Network Error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
<<<<<<< HEAD
        message: 'Network Error',
        code: ErrorCode.NETWORK_ERROR,
        userFriendlyMessage: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        action: '연결 확인',
        timestamp: expect.any(String),
=======
        message: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
        code: 'NETWORK_ERROR',
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      });
    });

    it('should handle 401 unauthorized errors', () => {
<<<<<<< HEAD
      const error = new AxiosError();
      error.response = {
        status: 401,
        data: { message: '인증이 필요합니다' },
      } as any;

      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '인증이 필요합니다',
        code: ErrorCode.AUTHENTICATION_ERROR,
        userFriendlyMessage: '로그인이 필요합니다. 이메일과 비밀번호를 확인해주세요.',
        action: '로그인 페이지로 이동',
        details: {},
        timestamp: expect.any(String),
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      });
    });

    it('should handle 403 forbidden errors', () => {
<<<<<<< HEAD
      const error = new AxiosError();
      error.response = {
        status: 403,
        data: { message: '권한이 없습니다' },
      } as any;

      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '권한이 없습니다',
        code: ErrorCode.AUTHORIZATION_ERROR,
        userFriendlyMessage: '이 작업을 수행할 권한이 없습니다. 관리자에게 문의해주세요.',
        action: '홈으로 이동',
        details: {},
        timestamp: expect.any(String),
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      });
    });

    it('should handle 404 not found errors', () => {
<<<<<<< HEAD
      const error = new AxiosError();
      error.response = {
        status: 404,
        data: { message: '리소스를 찾을 수 없습니다' },
      } as any;

      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '리소스를 찾을 수 없습니다',
        code: ErrorCode.RESOURCE_NOT_FOUND,
        userFriendlyMessage: '요청하신 페이지를 찾을 수 없습니다.',
        action: '이전 페이지로 이동',
        details: {},
        timestamp: expect.any(String),
      });
    });

    it('should handle validation errors', () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        data: {
          message: '유효성 검사 실패',
          details: {
            email: ['이메일 형식이 올바르지 않습니다'],
            password: ['비밀번호는 8자 이상이어야 합니다'],
          },
        },
      } as any;

      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: '유효성 검사 실패',
        code: ErrorCode.VALIDATION_ERROR,
        userFriendlyMessage: '올바른 이메일 형식을 입력해주세요.',
        details: {
          email: ['이메일 형식이 올바르지 않습니다'],
          password: ['비밀번호는 8자 이상이어야 합니다'],
        },
        timestamp: expect.any(String),
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
<<<<<<< HEAD
        message: 'Unknown error',
        code: ErrorCode.UNKNOWN_ERROR,
        userFriendlyMessage: 'Unknown error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('formatErrorMessage', () => {
    it('should format error message from string', () => {
      expect(formatErrorMessage('Test error')).toBe('Test error');
    });

    it('should format error message from Error object', () => {
      const error = new Error('Test error');
      expect(formatErrorMessage(error)).toBe('Test error');
    });

    it('should format error message from AxiosError', () => {
      const error = new AxiosError();
      error.response = {
        status: 400,
        data: { message: 'Bad request' },
      } as any;

      expect(formatErrorMessage(error)).toBe('입력하신 정보를 다시 확인해주세요.');
    });

    it('should handle undefined error', () => {
      expect(formatErrorMessage(undefined)).toBe('알 수 없는 오류가 발생했습니다.');
    });

    it('should handle null error', () => {
      expect(formatErrorMessage(null)).toBe('알 수 없는 오류가 발생했습니다.');
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
    });
  });
}); 