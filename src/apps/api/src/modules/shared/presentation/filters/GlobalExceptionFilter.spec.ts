import { ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { GlobalExceptionFilter } from './GlobalExceptionFilter';
import { DomainException } from '../../domain/exceptions/DomainException';
import { RequestIdAwareRequest } from '../middleware/RequestIdMiddleware';

class FakeDomainException extends DomainException {
  readonly code = 'FAKE_DOMAIN';

  constructor(message = 'domain error') {
    super(message);
  }
}

class NotFoundDomainException extends DomainException {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor() {
    super('not found');
  }
}

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let response: {
    headersSent: boolean;
    status?: jest.Mock;
    json?: jest.Mock;
  };

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    filter = new GlobalExceptionFilter();
    response = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  function host(
    request: Partial<Request> = {},
    requestId: string | undefined = 'rid-123',
  ): ArgumentsHost {
    const req = {
      originalUrl: '/residents/abc',
      method: 'GET',
      ...request,
      requestId,
    } as RequestIdAwareRequest;

    return {
      switchToHttp: () => ({
        getResponse: () => response as unknown as Response,
        getRequest: () => req,
      }),
    } as unknown as ArgumentsHost;
  }

  it('maps a DomainException to its code and default status 400', () => {
    filter.catch(new FakeDomainException('opaque message'), host());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      code: 'FAKE_DOMAIN',
      message: 'opaque message',
      path: '/residents/abc',
      requestId: 'rid-123',
    });
  });

  it('honours a custom statusCode on a DomainException', () => {
    filter.catch(new NotFoundDomainException(), host());

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: 'not found',
      path: '/residents/abc',
      requestId: 'rid-123',
    });
  });

  it('maps an HttpException keeping its status and message', () => {
    filter.catch(new BadRequestException('bad request'), host());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'bad request',
      path: '/residents/abc',
      requestId: 'rid-123',
    });
  });

  it('preserves an array message from validation HttpExceptions', () => {
    const exception = new BadRequestException(['email must be valid']);

    filter.catch(exception, host());

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: ['email must be valid'],
      path: '/residents/abc',
      requestId: 'rid-123',
    });
  });

  it('maps an unexpected error to a generic 500 without leaking details', () => {
    filter.catch(new Error('database exploded'), host());

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
      path: '/residents/abc',
      requestId: 'rid-123',
    });
  });

  it('does not write a response when headers were already sent', () => {
    response.headersSent = true;

    filter.catch(new Error('too late'), host());

    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });
});
