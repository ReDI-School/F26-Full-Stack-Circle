/**
 * Where the API lives.
 *
 * The frontend and the backend are one deployment, so the browser always
 * talks to a relative `/api`. In development, `next.config.ts` proxies
 * `/api/*` to the backend running on port 4000, so the same URL works
 * everywhere and there is nothing to configure.
 */
export const API_URL = '/api';

/** Builds an API URL: `apiUrl('/users')` → `/api/users`. */
export const apiUrl = (path: string): string => `${API_URL}/${path.replace(/^\//, '')}`;
