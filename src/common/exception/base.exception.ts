import { ErrorCode, INTERNAL_SERVER_ERROR } from './error-code/error.code';

// extend HttpException는 어떤가 https://docs.nestjs.com/exception-filters#custom-exceptions
// 일반적으로 Error를 상속받아서 처리하는 것은 도메인 관련된 에러일때 사용하고 Http관련 에러는 HttpException을 사용한다고 함
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
