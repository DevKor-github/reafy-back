import { BaseException } from './base.exception';
import { HASHTAG_NOT_FOUND, MEMO_NOT_FOUND } from './error-code/error.code';

export function MemoNotFoundException(message?: string): BaseException {
  return new BaseException(MEMO_NOT_FOUND, message);
}

export function HashtagNotFoundException(message?: string): BaseException {
  return new BaseException(HASHTAG_NOT_FOUND, message);
}
