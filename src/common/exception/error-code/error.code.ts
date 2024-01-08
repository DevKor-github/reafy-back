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
export const INVALID_LOGIN_ACCESS = new ErrorCodeObject(
  404,
  'Invalid Login Access',
);
