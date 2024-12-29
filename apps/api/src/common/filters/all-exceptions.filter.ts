import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationException } from '../exceptions/validation.exception';
import { ErrorCode } from '../enums/error-code.enum';

type ResponseBody = {
  code: string;
  message: string | object;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody: ResponseBody = {
      code: ErrorCode.GLOBAL_EXCEPTION,
      message: exception.message,
    };

    if (exception instanceof ValidationException) {
      responseBody.code = exception.getResponse().code;
      responseBody.message = exception.getResponse().message;
      return httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.BAD_REQUEST,
      );
    }

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
