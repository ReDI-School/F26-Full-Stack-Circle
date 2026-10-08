#!/usr/bin/env bash
# The backend service's Vercel build (see vercel.json). Runs from backend/.
#
# Production and previews use two separate Supabase projects. The production
# database variables are scoped to Production in Vercel, and the preview
# database's variables to Preview, under the same names. Production is
# migrated; the preview database is migrated and seeded.
set -euo pipefail

# The production Supabase project. A preview must never touch it.
PRODUCTION_SUPABASE_REF="pkthbsbsfauvjpqtyusf"

if [[ "${VERCEL_ENV:-}" == "production" || "${VERCEL_ENV:-}" == "preview" ]]; then
  # Without these, prisma.config.ts would fall back to localhost. Stop with a
  # clear message instead.
  if [[ -z "${POSTGRES_URL_NON_POOLING:-}" || -z "${POSTGRES_PRISMA_URL:-}" ]]; then
    echo "error: POSTGRES_URL_NON_POOLING / POSTGRES_PRISMA_URL are not set for this ${VERCEL_ENV} build." >&2
    echo "Check that the ${VERCEL_ENV} database is connected to the Vercel project for the ${VERCEL_ENV} environment." >&2
    exit 1
  fi

  if [[ "${VERCEL_ENV}" == "preview" &&
    ("${POSTGRES_URL_NON_POOLING}" == *"${PRODUCTION_SUPABASE_REF}"* ||
    "${POSTGRES_PRISMA_URL}" == *"${PRODUCTION_SUPABASE_REF}"*) ]]; then
    echo "error: this preview build is pointed at the production database." >&2
    echo "Previews must use the preview database. Fix the Vercel environment variables." >&2
    exit 1
  fi

  pnpm exec prisma migrate deploy
fi

pnpm exec prisma generate

# Seed data is for previews only. The seed upserts, so running it on every
# deployment is safe.
if [[ "${VERCEL_ENV:-}" == "preview" ]]; then
  pnpm db:seed
fi
