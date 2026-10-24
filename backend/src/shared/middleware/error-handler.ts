// src/shared/middlewares/error-handler.ts
import type { ErrorRequestHandler, RequestHandler } from 'express';
import {
  AppError,
  ErrorKind,
  NotFoundError,
  isRecordNotFound,
  isUniqueViolation,
} from '@/shared/errors';

const statusByKind: Record<ErrorKind, number> = {
  validation: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
};

const isZodError = (e: any): e is { issues: { path: PropertyKey[]; message: string }[] } =>
  e?.name === 'ZodError' && Array.isArray(e.issues);

export const notFoundHandler: RequestHandler = (req, _res, next) =>
  next(new NotFoundError('Route', `${req.method} ${req.path}`));

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = 500;
  let body: Record<string, unknown> = {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong.',
  };

  if (err instanceof AppError) {
    status = statusByKind[err.kind];
    body = { code: err.code, message: err.message, details: err.details };
  } else if (isZodError(err)) {
    status = 400;
    body = {
      code: 'VALIDATION_ERROR',
      message: 'Invalid request.',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    };
  } else if (isUniqueViolation(err)) {
    status = 409;
    body = { code: 'CONFLICT', message: 'Resource already exists.' };
  } else if (isRecordNotFound(err)) {
    status = 404;
    body = { code: 'NOT_FOUND', message: 'Resource not found.' };
  } else if (typeof err?.status === 'number' && err.status < 500) {
    status = err.status;
    body = { code: 'BAD_REQUEST', message: 'Bad request.' };
  }

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  res.status(status).json({ error: body });
};
