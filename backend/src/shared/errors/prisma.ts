// src/shared/errors/prisma.ts
import { Prisma } from '@generated/prisma/client';
import { ConflictError, NotFoundError } from './app-error';

const isPrismaError = (e: unknown, code: string) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === code;

export const isUniqueViolation = (e: unknown) => isPrismaError(e, 'P2002');
export const isRecordNotFound = (e: unknown) => isPrismaError(e, 'P2025');

export function ensureFound<T>(
  value: T | null | undefined,
  entity: string,
  id?: string | number
): T {
  if (value == null) throw new NotFoundError(entity, id);
  return value;
}

export async function withPrisma<T>(entity: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (isRecordNotFound(e)) throw new NotFoundError(entity);
    if (isUniqueViolation(e)) throw new ConflictError(entity);
    throw e;
  }
}
