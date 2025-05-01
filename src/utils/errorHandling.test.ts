import { AxiosError } from 'axios';
import { handleApiError, formatErrorMessage, ErrorCode } from './errorHandling';

describe('Error Handling', () => {
  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const error = new Error('Network Error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
        message: 'Network Error',
        code: ErrorCode.NETWORK_ERROR,
        userFriendlyMessage: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        action: '연결 확인',
        timestamp: expect.any(String),
      });
    });

    it('should handle 401 unauthorized errors', () => {
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
      });
    });

    it('should handle 403 forbidden errors', () => {
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
      });
    });

    it('should handle 404 not found errors', () => {
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
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
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
    });
  });
}); 