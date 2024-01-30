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

// filter에서 뿐만 아니라 다른 service에서도 해당 함수를 사용할 수 있게 이름 변경
export function InternalServerException(message?: string): BaseException {
  return new BaseException(INTERNAL_SERVER_ERROR, message);
}
