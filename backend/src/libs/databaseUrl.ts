/**
 * Supabase's connection strings come with `sslmode=require`.
 *
 * Prisma 7 talks to PostgreSQL through node-postgres, which verifies the
 * server certificate against the system CAs -- and Supabase's pooler serves a
 * chain those do not cover, so connecting fails with
 * SELF_SIGNED_CERT_IN_CHAIN. `no-verify` keeps the connection encrypted but
 * skips the chain check.
 *
 * The local Docker database does not use TLS at all, so this only changes
 * anything for the hosted database.
 */
export const relaxSslVerification = (url: string | undefined) =>
  url?.replace('sslmode=require', 'sslmode=no-verify');
