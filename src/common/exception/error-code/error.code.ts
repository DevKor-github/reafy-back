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
