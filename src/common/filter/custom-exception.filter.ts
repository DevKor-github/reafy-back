import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException, UncatchedException } from '../exception/base.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const customException =
      exception instanceof BaseException ? exception : UncatchedException();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = customException.errorCode.status;

    response.status(status).json({
      statusCode: status,
      message: customException.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
