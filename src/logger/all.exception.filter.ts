import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getLoggerMessage } from './message.helper';
import {
  CustomHTTPExceptionResponse,
  HTTPExceptionResponse,
} from '../interfaces/interfase';
import { LoggerService } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private loggerService: LoggerService;

  constructor() {
    this.loggerService = new LoggerService();
  }

  private getErrorData = async (
    statusCode: number,
    error: string,
    { path, method }: Request,
  ): Promise<CustomHTTPExceptionResponse> => {
    return {
      statusCode,
      error,
      path,
      method,
      timestamp: new Date(),
    };
  };

  catch = async (exception: unknown, host: ArgumentsHost): Promise<any> => {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const { path, query, body, method } = req;

    let status: HttpStatus;
    let errMessage: string;
    let stack = '';

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as HTTPExceptionResponse;
      status = exception.getStatus();
      errMessage = errorResponse.error || exception.message;
      stack = exception.stack;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errMessage = 'Internal erver error';
    }

    const responseError = await this.getErrorData(status, errMessage, req);
    const mesForLogger = getLoggerMessage(
      { path, query, body, method, status },
      stack,
    );

    this.loggerService.error(mesForLogger);
    resp.status(status).json(responseError);
  };
}
