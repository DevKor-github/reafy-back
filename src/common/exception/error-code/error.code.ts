import { HttpStatus } from '@nestjs/common';

export interface ErrorCode {
  status: number;
  message: string;
  errorCode?: string;
}

class ErrorCodeObject implements ErrorCode {
  readonly status: number;
  readonly message: string;
  readonly errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }
}

// client에서 같은 httpstatus code라도 에러를 구분할 수 있게 추가
// aabb : aa 도메인 구분 bb 에러 구분
export enum ErrorCodeEnum {
  INTERNAL_SERVER_ERROR = '0000',
  VENDOR_NOT_EXIST = '0101',
  BAD_ACCESS_TOKEN = '0102',
  INVALID_REFRESH_TOKEN = '0103',
  UNAUTHORIZED_USER = '0104',
  USER_NOT_FOUND = '0105',
  API_ACCESS_ERROR = '0201',
  INVALID_LOGIN_ACCESS = '0202',
  INVALID_ISBN = '0203',
  BOOK_NOT_FOUND = '0204',
  ALREADY_EXIST_BOOK = '0205',
  MEMO_NOT_FOUND = '0301',
  HASHTAG_NOT_FOUND = '0302',
  HISTORY_NOT_FOUND = '0401',
  NOT_ENOUGH_COIN = '0501',
  INVALID_DATE_FORMAT = '0601',
  UNDEFINED_EXCEPTION = '9999',
}

export const INTERNAL_SERVER_ERROR = new ErrorCodeObject(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'Internal Server Error',
  ErrorCodeEnum.INTERNAL_SERVER_ERROR,
);
//AuthService ErrorCode
export const VENDOR_NOT_EXIST = new ErrorCodeObject(
  HttpStatus.BAD_REQUEST,
  'Vendor Not Exist',
  ErrorCodeEnum.VENDOR_NOT_EXIST,
);

export const BAD_ACCESS_TOKEN = new ErrorCodeObject(
  HttpStatus.UNAUTHORIZED,
  'Bad Access Token',
  ErrorCodeEnum.BAD_ACCESS_TOKEN,
); //Unauthorized

export const INVALID_REFRESH_TOKEN = new ErrorCodeObject(
  HttpStatus.UNAUTHORIZED,
  'Invalid Refresh Token',
  ErrorCodeEnum.INVALID_REFRESH_TOKEN,
);

export const UNAUTHORIZED_USER = new ErrorCodeObject(
  HttpStatus.UNAUTHORIZED,
  'Unauthorized User',
  ErrorCodeEnum.UNAUTHORIZED_USER,
);

//UserService ErrorCode
export const USER_NOT_FOUND = new ErrorCodeObject(
  HttpStatus.NOT_FOUND,
  'User Not FOUND',
  ErrorCodeEnum.USER_NOT_FOUND,
);

//BookService ErrorCode
export const API_ACCESS_ERROR = new ErrorCodeObject(
  HttpStatus.INTERNAL_SERVER_ERROR,
  'API access Error',
  ErrorCodeEnum.API_ACCESS_ERROR,
); //0201
export const INVALID_LOGIN_ACCESS = new ErrorCodeObject( //0202
  HttpStatus.BAD_REQUEST,
  'Invalid Login Access',
  ErrorCodeEnum.INVALID_LOGIN_ACCESS,
);

export const INVALID_ISBN = new ErrorCodeObject(
  HttpStatus.BAD_REQUEST,
  'Invalid ISBN',
  ErrorCodeEnum.INVALID_ISBN,
); //0203

export const BOOK_NOT_FOUND = new ErrorCodeObject( //0204
  HttpStatus.NOT_FOUND,
  'Requested BookshelfBook is NOT FOUND ',
  ErrorCodeEnum.BOOK_NOT_FOUND,
);
export const ALREADY_EXIST_BOOK = new ErrorCodeObject( //0205
  HttpStatus.CONFLICT,
  'Requested Book Already Exists',
  ErrorCodeEnum.ALREADY_EXIST_BOOK,
);

//MemoService ErrorCode
export const MEMO_NOT_FOUND = new ErrorCodeObject( //0301
  HttpStatus.NOT_FOUND,
  'Requested Memo is NOT FOUND',
  ErrorCodeEnum.MEMO_NOT_FOUND,
);

export const HASHTAG_NOT_FOUND = new ErrorCodeObject( //0302
  HttpStatus.NOT_FOUND,
  'Requested Hashtag is NOT FOUND',
  ErrorCodeEnum.HASHTAG_NOT_FOUND,
);

//HistoryService ErrorCode
export const HISTORY_NOT_FOUND = new ErrorCodeObject( //0401
  HttpStatus.NOT_FOUND,
  'Requested History is NOT FOUND',
  ErrorCodeEnum.HISTORY_NOT_FOUND,
);

//CoinService ErrorCode
export const NOT_ENOUGH_COIN = new ErrorCodeObject(
  HttpStatus.BAD_REQUEST,
  'Not Enought Coin',
  ErrorCodeEnum.NOT_ENOUGH_COIN,
); //0501

//ItemService ErrorCode - none

//StatisticsService ErrorCode - 06
export const INVALID_DATE_FORMAT = new ErrorCodeObject(
  HttpStatus.BAD_REQUEST,
  'Invalid Date Format',
  ErrorCodeEnum.INVALID_DATE_FORMAT,
); //0501

