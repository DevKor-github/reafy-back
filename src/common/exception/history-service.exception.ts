import { BaseException } from './base.exception';
import { HISTORY_NOT_FOUND } from './error-code/error.code';

export function HistoryNotFound(message?: string): BaseException {
  return new BaseException(HISTORY_NOT_FOUND, message);
}
