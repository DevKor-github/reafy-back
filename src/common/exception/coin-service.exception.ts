import { BaseException } from './base.exception';
import { NOT_ENOUGH_COIN } from './error-code/error.code';

export function NotEnoughCoinException(message?: string): BaseException {
  return new BaseException(NOT_ENOUGH_COIN, message);
}
