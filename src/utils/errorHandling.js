import { AxiosError } from 'axios';
import i18n from '../i18n';
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    ErrorCode["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
    ErrorCode["AUTHORIZATION_ERROR"] = "AUTHORIZATION_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ErrorCode["CONFLICT_ERROR"] = "CONFLICT_ERROR";
    ErrorCode["RATE_LIMIT_ERROR"] = "RATE_LIMIT_ERROR";
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
})(ErrorCode || (ErrorCode = {}));
class AppError extends Error {
    code;
    details;
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }
}
export function getErrorDetails(error) {
    if (error instanceof AxiosError) {
        const response = error.response?.data;
        return response?.details;
    }
    if (error instanceof AppError) {
        return error.details;
    }
    return undefined;
}
export function getUserFriendlyMessage(error) {
    if (error instanceof AxiosError) {
        const response = error.response?.data;
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
export function getErrorCode(error) {
    if (error instanceof AxiosError) {
        const response = error.response?.data;
        return response?.code || `HTTP_${error.response?.status || 'UNKNOWN'}`;
    }
    if (error instanceof AppError) {
        return error.code;
    }
    return 'UNKNOWN_ERROR';
}
export function handleApiError(error) {
    if (error instanceof AxiosError) {
        const response = error.response;
        if (response) {
            const data = response.data;
            throw new AppError(data.message || i18n.t('errors.unknown'), data.code || `HTTP_${response.status}`, data.details);
        }
        if (error.request) {
            throw new AppError(i18n.t('errors.networkError'), 'NETWORK_ERROR');
        }
    }
    if (error instanceof Error) {
        throw new AppError(error.message, 'UNKNOWN_ERROR');
    }
    throw new AppError(i18n.t('errors.unknown'), 'UNKNOWN_ERROR');
}
export function isAppError(error) {
    return error instanceof AppError;
}
export function getErrorMessage(error) {
    if (isAppError(error)) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return i18n.t('errors.unknown');
}
export function formatErrorMessage(error) {
    const message = getErrorMessage(error);
    const code = getErrorCode(error);
    const details = getErrorDetails(error);
    if (details) {
        return `${message} (${code}): ${JSON.stringify(details)}`;
    }
    return `${message} (${code})`;
}
