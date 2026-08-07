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
import { resolveRequestId } from '../middleware/RequestIdMiddleware';

interface ErrorResponseBody {
  statusCode: number;
  code?: string;
  message: string | string[];
  path: string;
  requestId: string;
}

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

    const path = request.originalUrl ?? request.url;
    const requestId = resolveRequestId(request);

    if (exception instanceof DomainException) {
      this.logger.warn(
        `${exception.code} [${request.method}] ${path} — ${exception.message} (requestId: ${requestId})`,
      );

      this.sendError(response, {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        path,
        requestId,
      });
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
        `HTTP ${status} [${request.method}] ${path} — ${exception.message} (requestId: ${requestId})`,
      );

      this.sendError(response, {
        statusCode: status,
        message,
        path,
        requestId,
      });
      return;
    }

    this.logger.error(
      `UNEXPECTED [${request.method}] ${path} (requestId: ${requestId})`,
      exception instanceof Error ? exception.stack : '',
    );

    this.sendError(response, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      path,
      requestId,
    });
  }

  private sendError(response: Response, body: ErrorResponseBody) {
    response.status(body.statusCode).json({
      statusCode: body.statusCode,
      ...(body.code === undefined ? {} : { code: body.code }),
      message: body.message,
      path: body.path,
      requestId: body.requestId,
    });
  }
}
