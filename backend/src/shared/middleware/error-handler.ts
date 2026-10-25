import { STATUS_CODES } from 'node:http';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError, type ErrorKind, NotFoundError, translatePrismaError } from '@/shared/errors';

const statusByKind: Record<ErrorKind, number> = {
  validation: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
};

type ZodLikeError = {
  name: 'ZodError';
  issues: { path: PropertyKey[]; message: string }[];
};

const isZodError = (e: unknown): e is ZodLikeError =>
  typeof e === 'object' &&
  e !== null &&
  (e as { name?: unknown }).name === 'ZodError' &&
  Array.isArray((e as { issues?: unknown }).issues);

const getHttpStatus = (e: unknown): number | undefined => {
  if (typeof e !== 'object' || e === null) return undefined;
  const { status, statusCode } = e as { status?: unknown; statusCode?: unknown };
  const s = typeof status === 'number' ? status : statusCode;
  return typeof s === 'number' && s >= 400 && s < 600 ? s : undefined;
};

const toErrorCode = (status: number) =>
  (STATUS_CODES[status] ?? 'Error').toUpperCase().replace(/[^A-Z0-9]+/g, '_');

export const notFoundHandler: RequestHandler = (req, _res, next) =>
  next(new NotFoundError('Route', `${req.method} ${req.path}`));

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const error = translatePrismaError(err) ?? err;

  let status = 500;
  let body: Record<string, unknown> = {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong.',
  };

  if (error instanceof AppError) {
    status = statusByKind[error.kind];
    body = { code: error.code, message: error.message, details: error.details };
  } else if (isZodError(error)) {
    status = 400;
    body = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request.',
      details: error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    };
  } else {
    const httpStatus = getHttpStatus(error);
    if (httpStatus !== undefined && httpStatus < 500) {
      status = httpStatus;
      body = {
        code: toErrorCode(httpStatus),
        message: error.expose ? error.message : STATUS_CODES[httpStatus],
      };
    }
  }

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }

  res.status(status).json({ error: body });
};
