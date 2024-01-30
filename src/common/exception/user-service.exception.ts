import { BaseException } from './base.exception';
import { USER_NOT_FOUND } from './error-code/error.code';

export function UserNotFoundException(message?: string): BaseException {
  return new BaseException(USER_NOT_FOUND, message);
}
