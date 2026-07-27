import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { DomainException } from '../../../domain/exceptions/DomainException';
import { InvalidCredentialException } from '../../../application/exceptions/InvalidCredentialException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<{ method: string; url: string }>();

    if (exception instanceof InvalidCredentialException) {
      this.logger.warn(`UNAUTHORIZED [${request.method}] ${request.url} — ${exception.message}`);

      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: exception.code,
        message: exception.message,
      });
    }

    if (exception instanceof DomainException) {
      this.logger.warn(`${exception.code} [${request.method}] ${request.url} — ${exception.message}`);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        code: exception.code,
        message: exception.message,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      this.logger.warn(`HTTP ${status} [${request.method}] ${request.url} — ${exception.message}`);

      return response.status(status).json({
        statusCode: status,
        message: typeof body === 'string' ? body : (body as any).message,
      });
    }

    this.logger.error(
      `UNEXPECTED [${request.method}] ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}