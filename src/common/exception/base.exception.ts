import { ErrorCode, INTERNAL_SERVER_ERROR } from './error-code/error.code';

export class BaseException extends Error {
  readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message ? message : errorCode.message);
    this.errorCode = errorCode;
  }
}

/*export const InvalidLoginAccessException = (
  message?: string,
): BaseException => {
  return new BaseException(INVALID_LOGIN_ACCESS, message);
};*/

export function InternalServerException(message?: string): BaseException {
  return new BaseException(INTERNAL_SERVER_ERROR, message);
}
