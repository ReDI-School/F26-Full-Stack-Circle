import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * In production, Vercel routes `/api` to the backend service before the
   * request ever reaches Next.js (see vercel.json). In development there is
   * no such router, so we proxy `/api/*` to the backend on port 4000 —
   * that way the browser always calls the same relative `/api`.
   */
  async rewrites() {
    if (process.env.NODE_ENV === 'production') return [];

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
