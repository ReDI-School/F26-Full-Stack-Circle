import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Validates and sanitizes a redirect path from an untrusted source.
 * Only same-origin relative paths are allowed: must start with a single /,
 * cannot contain backslashes, and must resolve strictly within the origin.
 */
export function sanitizeNextPath(path: string | null | undefined): string {
  if (!path || typeof path !== 'string') {
    return '/';
  }

  // Must start with '/' and cannot start with '//' or contain any backslashes.
  // Backslashes are never valid in relative web paths and are used for bypasses.
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return '/';
  }

  try {
    const base = 'http://localhost';
    const url = new URL(path, base);

    // Ensure it strictly stayed on the dummy origin
    if (url.origin !== base) {
      return '/';
    }

    // Reconstruct the clean relative path (pathname + query + hash)
    const safePath = `${url.pathname}${url.search}${url.hash}`;
    if (!safePath.startsWith('/') || safePath.startsWith('//') || safePath.includes('\\')) {
      return '/';
    }

    return safePath;
  } catch {
    return '/';
  }
}

/**
 * Reads ?next= from searchParams, validates it against open-redirect attacks,
 * and pushes the safe path. Use this after a successful login instead of
 * calling router.push with a raw query param value.
 */
export function pushNext(router: AppRouterInstance, searchParams: ReadonlyURLSearchParams): void {
  router.push(sanitizeNextPath(searchParams.get('next')));
}
