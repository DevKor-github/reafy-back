import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  BaseException,
  InternalServerException,
  UndefinedException,
} from '../exception/base.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    let customException: BaseException;
    if (exception instanceof BaseException) {
      customException = exception;
    } else if (exception instanceof HttpException) { // built-in exception 대응
      customException = UndefinedException(exception?.getStatus(), JSON.stringify(exception?.getResponse()));
    } else {
      customException = InternalServerException();
    }
    
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = customException.errorCode.status;
    const errorCode = customException.errorCode.errorCode;

    response.status(status).json({
      errorCode: errorCode,
      statusCode: status,
      message: customException.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
