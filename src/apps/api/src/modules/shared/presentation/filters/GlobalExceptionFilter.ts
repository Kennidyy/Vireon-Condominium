import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainException } from '../../domain/exceptions/DomainException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (response.headersSent) {
      return;
    }

    if (exception instanceof DomainException) {
      this.logger.warn(
        `${exception.code} [${request.method}] ${request.url} — ${exception.message}`,
      );

      this.sendError(
        response,
        exception.statusCode,
        exception.code,
        exception.message,
      );
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      const message: string | string[] =
        typeof body === 'string'
          ? body
          : (((body as Record<string, unknown>).message as
              string | string[] | undefined) ?? 'Internal server error');

      this.logger.warn(
        `HTTP ${status} [${request.method}] ${request.url} — ${exception.message}`,
      );

      this.sendError(response, status, undefined, message);
      return;
    }

    this.logger.error(
      `UNEXPECTED [${request.method}] ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    this.sendError(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      undefined,
      'Internal server error',
    );
  }

  private sendError(
    response: Response,
    status: number,
    code: string | undefined,
    message: string | string[],
  ) {
    response.status(status).json({
      statusCode: status,
      ...(code === undefined ? {} : { code }),
      message,
    });
  }
}
