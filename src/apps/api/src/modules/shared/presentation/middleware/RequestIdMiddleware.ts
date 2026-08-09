import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const REQUEST_ID_HEADER = 'x-request-id';

const MAX_REQUEST_ID_LENGTH = 64;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9._:-]+$/;

export interface RequestIdAwareRequest extends Request {
  requestId?: string;
}

/** Reúne o request ID gerado pelo middleware, priorizando o sobrevivente na resposta. */
export function resolveRequestId(req: Request): string {
  const aware = req as RequestIdAwareRequest;
  return aware.requestId ?? '';
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.headers[REQUEST_ID_HEADER];

    const header =
      typeof incoming === 'string' &&
      incoming.length > 0 &&
      incoming.length <= MAX_REQUEST_ID_LENGTH &&
      REQUEST_ID_PATTERN.test(incoming)
        ? incoming
        : undefined;

    const requestId = header ?? randomUUID();

    (req as RequestIdAwareRequest).requestId = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);

    next();
  }
}
