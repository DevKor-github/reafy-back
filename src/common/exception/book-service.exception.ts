import { BaseException } from './base.exception';
import {
  ALREADY_EXIST_BOOK,
  API_ACCESS_ERROR,
  BOOK_NOT_FOUND,
  INVALID_ISBN,
} from './error-code/error.code';

export function ApiAccessErrorException(message?: string): BaseException {
  return new BaseException(API_ACCESS_ERROR, message);
}

export function InvalidISBNException(message?: string): BaseException {
  return new BaseException(INVALID_ISBN, message);
}

export function BookNotFoundException(message?: string): BaseException {
  return new BaseException(BOOK_NOT_FOUND, message);
}

export function AlreadyBookExistException(message?: string): BaseException {
  return new BaseException(ALREADY_EXIST_BOOK, message);
}
