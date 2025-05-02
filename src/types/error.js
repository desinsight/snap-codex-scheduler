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
