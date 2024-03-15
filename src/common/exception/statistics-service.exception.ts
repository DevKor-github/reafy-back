import { BaseException } from "./base.exception";
import { INVALID_DATE_FORMAT } from "./error-code/error.code";

//none
export function InvalidDateFormatException(message?: string): BaseException {
    return new BaseException(INVALID_DATE_FORMAT, message);
  }
  