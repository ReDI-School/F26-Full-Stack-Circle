export type ErrorKind = 'validation' | 'unauthorized' | 'forbidden' | 'not_found' | 'conflict';

export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind;

  constructor(
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  readonly kind = 'validation' as const;
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, details);
  }
}

export class UnauthorizedError extends AppError {
  readonly kind = 'unauthorized' as const;
  constructor(message = 'Authentication required.') {
    super('UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  readonly kind = 'forbidden' as const;
  constructor(message = 'You do not have permission to do this.') {
    super('FORBIDDEN', message);
  }
}

export class NotFoundError extends AppError {
  readonly kind = 'not_found' as const;
  constructor(entity: string, id?: string | number) {
    super(
      `${entity.toUpperCase()}_NOT_FOUND`,
      id !== undefined ? `${entity} '${id}' not found.` : `${entity} not found.`
    );
  }
}

export class ConflictError extends AppError {
  readonly kind = 'conflict' as const;
  constructor(entity: string, message = `${entity} already exists.`) {
    super(`${entity.toUpperCase()}_ALREADY_EXISTS`, message);
  }
}
