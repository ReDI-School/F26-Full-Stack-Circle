import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Validates a redirect path from an untrusted source.
 * Only same-origin paths are allowed: must start with a single /, not //.
 */
function sanitizeNextPath(path: string | null | undefined): string {
  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path;
  }
  return '/';
}

/**
 * Reads ?next= from searchParams, validates it against open-redirect attacks,
 * and pushes the safe path. Use this after a successful login instead of
 * calling router.push with a raw query param value.
 */
export function pushNext(
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams
): void {
  router.push(sanitizeNextPath(searchParams.get('next')));
}
