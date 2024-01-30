import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  BaseException,
  InternalServerException,
} from '../exception/base.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const customException =
      exception instanceof BaseException
        ? exception
        : InternalServerException();

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
