#!/usr/bin/env bash
# The backend service's Vercel build (see vercel.json). Runs from backend/.
#
# Production migrates the production database. Every pull request gets its
# own Supabase preview branch database, so a preview migrates and seeds that
# branch database — never production. Supabase syncs the branch's variables
# to Vercel when the PR is opened, under the same names as production.
set -euo pipefail

if [[ "${VERCEL_ENV:-}" == "production" || "${VERCEL_ENV:-}" == "preview" ]]; then
  # The database variables are scoped to Production only in Vercel, so in a
  # preview they exist only once Supabase has synced the branch database.
  # Stop here instead of letting prisma.config.ts fall back to localhost.
  # Supabase redeploys the PR on its own once the variables are in place.
  if [[ -z "${POSTGRES_URL_NON_POOLING:-}" || -z "${POSTGRES_PRISMA_URL:-}" ]]; then
    echo "error: POSTGRES_URL_NON_POOLING / POSTGRES_PRISMA_URL are not set for this ${VERCEL_ENV} build." >&2
    echo "For a preview: the Supabase branch for this pull request is not ready yet." >&2
    echo "Supabase redeploys the PR once it is; if it does not, check the Supabase branch status on the PR." >&2
    exit 1
  fi

  pnpm exec prisma migrate deploy
fi

pnpm exec prisma generate

# Seed data is for previews only. The seed upserts, so running it on every
# deployment of the same branch is safe.
if [[ "${VERCEL_ENV:-}" == "preview" ]]; then
  pnpm db:seed
fi
