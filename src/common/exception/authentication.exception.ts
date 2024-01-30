import { BaseException } from './base.exception';
import {
  BAD_ACCESS_TOKEN,
  INVALID_LOGIN_ACCESS,
  INVALID_REFRESH_TOKEN,
  UNAUTHORIZED_USER,
  VENDOR_NOT_EXIST,
} from './error-code/error.code';

export function InvalidLoginAccessException(message?: string): BaseException {
  return new BaseException(INVALID_LOGIN_ACCESS, message);
}

export function VendorNotExistException(message?: string): BaseException {
  return new BaseException(VENDOR_NOT_EXIST, message);
}

export function BadAccessTokenException(message?: string): BaseException {
  return new BaseException(BAD_ACCESS_TOKEN, message);
}

export function InvalidRefreshTokenException(message?: string): BaseException {
  return new BaseException(INVALID_REFRESH_TOKEN, message);
}

export function UnauthorizedUserException(message?: string): BaseException {
  return new BaseException(UNAUTHORIZED_USER, message);
}
