import { BaseException } from './base.exception';
import { INVALID_LOGIN_ACCESS } from './error-code/error.code';

export function InvalidLoginAccessException(message?: string): BaseException {
  return new BaseException(INVALID_LOGIN_ACCESS, message);
}
