import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RequestIdAwareRequest } from './RequestIdMiddleware';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', () => {
      const requestId = (req as RequestIdAwareRequest).requestId;
      const duration = Date.now() - startedAt;

      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms requestId=${requestId ?? '-'}`,
      );
    });

    next();
  }
}
