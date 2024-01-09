class ErrorCodeObject {
  readonly status: number;
  readonly message: string;

  constructor(status, message) {
    this.status = status;
    this.message = message;
  }
}

export type ErrorCode = ErrorCodeObject;

export const INTERNAL_SERVER_ERROR = new ErrorCodeObject(
  500,
  'Internal Server Error',
);
//AuthService ErrorCode
export const VENDOR_NOT_EXIST = new ErrorCodeObject(400, 'Vendor Not Exist');

export const BAD_ACCESS_TOKEN = new ErrorCodeObject(400, 'Bad Access Token');

export const INVALID_REFRESH_TOKEN = new ErrorCodeObject(
  401,
  'Invalid Refresh Token',
);

export const UNAUTHORIZED_USER = new ErrorCodeObject(401, 'Unauthorized User');

//UserService ErrorCode
export const USER_NOT_FOUND = new ErrorCodeObject(404, 'User Not FOUND');

//BookService ErrorCode
export const API_ACCESS_ERROR = new ErrorCodeObject(500, 'API access Error');
export const INVALID_LOGIN_ACCESS = new ErrorCodeObject(
  400,
  'Invalid Login Access',
);

export const INVALID_ISBN = new ErrorCodeObject(400, 'Invalid ISBN');

export const BOOK_NOT_FOUND = new ErrorCodeObject(
  404,
  'Requested BookshelfBook is NOT FOUND ',
);
export const ALREADY_EXIST_BOOK = new ErrorCodeObject(
  409,
  'Requested Book Already Exists',
);

//MemoService ErrorCode
export const MEMO_NOT_FOUND = new ErrorCodeObject(
  404,
  'Requested Memo is NOT FOUND',
);

export const HASHTAG_NOT_FOUND = new ErrorCodeObject(
  404,
  'Requested Hashtag is NOT FOUND',
);

//HistoryService ErrorCode
export const HISTORY_NOT_FOUND = new ErrorCodeObject(
  404,
  'Requested History is NOT FOUND',
);

//CoinService ErrorCode
export const NOT_ENOUGH_COIN = new ErrorCodeObject(400, 'Not Enought Coin');

//ItemService ErrorCode - none

//StatisticsService ErrorCode - none
