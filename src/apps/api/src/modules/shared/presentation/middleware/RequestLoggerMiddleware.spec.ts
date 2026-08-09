import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RequestLoggerMiddleware } from './RequestLoggerMiddleware';

describe('RequestLoggerMiddleware', () => {
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerSpy = jest
      .spyOn(Logger.prototype, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerSpy.mockRestore();
  });

  it('should log the request summary once the response finishes', () => {
    const middleware = new RequestLoggerMiddleware();

    const req = {
      method: 'GET',
      originalUrl: '/residents?name=Ana',
    } as unknown as Request;

    const finishHandlers: Array<() => void> = [];
    const res = {
      statusCode: 200,
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') {
          finishHandlers.push(cb);
        }
      }),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    middleware.use(
      {
        ...req,
        requestId: 'abc-123',
      } as unknown as Request,
      res,
      next,
    );

    finishHandlers.forEach((cb) => cb());

    expect(next).toHaveBeenCalledTimes(1);
    expect(loggerSpy).toHaveBeenCalledTimes(1);

    const calls = loggerSpy.mock.calls as Array<Array<string | undefined>>;
    const message = calls[0]?.[0] ?? '';
    expect(message).toContain('GET /residents?name=Ana 200');
    expect(message).toContain('requestId=abc-123');
  });

  it('should fall back to "-" when no request id is present', () => {
    const middleware = new RequestLoggerMiddleware();

    const req = {
      method: 'POST',
      originalUrl: '/residents',
    } as unknown as Request;

    const finishHandlers: Array<() => void> = [];
    const res = {
      statusCode: 201,
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') {
          finishHandlers.push(cb);
        }
      }),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    middleware.use(req, res, next);

    finishHandlers.forEach((cb) => cb());

    const calls = loggerSpy.mock.calls as Array<Array<string | undefined>>;
    const message = calls[0]?.[0] ?? '';
    expect(message).toContain('POST /residents 201');
    expect(message).toContain('requestId=-');
  });
});
