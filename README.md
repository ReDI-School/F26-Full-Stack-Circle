# ♻️ ReDiCycle — ReDi Full Stack Circle

Welcome to the ReDi Full Stack Circle project. **ReDiCycle** is a second-hand store: people
list items they no longer need, and other people give those items a second life.

This repository is your **starting point**. It contains the project structure, the tooling
setup and a small set of example files. The features are yours to build.

## Prerequisites

- **Node.js** 24 or higher (see `.nvmrc` — if you use `nvm`, run `nvm use`)
- **pnpm** 11 or higher — install it with `npm install -g pnpm` or `corepack enable`
- **Docker** — used to run the PostgreSQL database

## Getting started

### 1. Install the dependencies

```bash
pnpm install
```

One command installs both `frontend` and `backend`: this repository is a **pnpm workspace**,
so they share a single `node_modules` and a single lockfile.

### 2. Start the database

```bash
pnpm db:up
```

### 3. Create your environment file

```bash
cp backend/.env.example backend/.env
```

The defaults already match the Docker database, so there is nothing to edit. The frontend needs
no configuration at all — it calls the API at `/api` in every environment.

### 4. Create the tables and add the seed data

```bash
pnpm db:deploy
pnpm db:seed
```

`pnpm db:deploy` applies the migration files in `backend/prisma/migrations/` to your database.
When you _change_ `schema.prisma`, use `pnpm db:migrate` instead — it creates a new migration
file, which you commit with your pull request. See
[Changing the database schema](#changing-the-database-schema).

### 5. Run the app

```bash
pnpm start:all
```

- Frontend → <http://localhost:3000>
- Backend → <http://localhost:4000/api>
- Storybook → run `pnpm storybook`, then <http://localhost:6006>

Two endpoints are useful for checking things are wired up:

| Endpoint      | What it tells you                                                    |
| ------------- | -------------------------------------------------------------------- |
| `/api`        | the API is running                                                   |
| `/api/health` | the API is running **and** can reach the database (503 if it cannot) |

## All the commands

Run these from the root of the project.

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm install`        | Install every dependency, frontend and backend                      |
| `pnpm start:all`      | Run the frontend and the backend together                           |
| `pnpm start:frontend` | Run only the frontend                                               |
| `pnpm start:backend`  | Run only the backend                                                |
| `pnpm storybook`      | Open Storybook, the component library                               |
| `pnpm build`          | Build both projects                                                 |
| `pnpm typecheck`      | Type-check both projects                                            |
| `pnpm db:up`          | Start the PostgreSQL container                                      |
| `pnpm db:down`        | Stop it (your data is kept)                                         |
| `pnpm db:reset`       | Delete the data and start over                                      |
| `pnpm db:migrate`     | Create a migration from your `schema.prisma` changes and apply it   |
| `pnpm db:deploy`      | Apply the existing migrations (what CI and Vercel run)              |
| `pnpm db:push`        | Apply `schema.prisma` without a migration file (throwaway DBs only) |
| `pnpm db:seed`        | Insert the seed data                                                |
| `pnpm db:studio`      | Browse the data in Prisma Studio                                    |
| `pnpm lint`           | Lint both projects                                                  |
| `pnpm format`         | Format both projects with Prettier                                  |
| `pnpm format:check`   | Check formatting without changing anything                          |
| `pnpm clean`          | Delete build output and `node_modules` (run `pnpm install` after)   |

> [!TIP]
> To run a command inside one workspace only, use `--filter`:
> `pnpm --filter frontend build`

## Continuous Integration

Every pull request is checked automatically by GitHub Actions
(`.github/workflows/ci.yml`). Three jobs run in parallel:

| Job            | What it checks                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | lint, typecheck, `next build`, and that Storybook still builds                                                            |
| **Backend**    | lint, typecheck, `tsc` build, then applies the committed migrations and runs the seed against a real throwaway PostgreSQL |
| **Formatting** | that the `frontend` and `backend` files are formatted with Prettier                                                       |

**Your pull request cannot be merged while any of these are red.**

> [!IMPORTANT]
> These jobs are **not running yet** — the checks on your PR will stay empty for now. Until
> they come online, running the commands below before you push is the only thing standing
> between a mistake and the deployed app.

You can run exactly the same checks locally before you push — this is much faster than
waiting for CI:

```bash
pnpm lint
pnpm format:check    # or `pnpm format` to fix the formatting
pnpm typecheck
pnpm build
```

See [Before you ask for a review](./CONTRIBUTING.md#before-you-ask-for-a-review) for the full
local equivalent of every CI job.

> [!TIP]
> If the Backend job fails on "Apply the migrations to the database", it usually means a
> migration file is missing or does not apply cleanly. Try `pnpm db:reset` followed by
> `pnpm db:deploy` locally to reproduce it. A missing migration is the usual cause: you changed
> `schema.prisma` but ran `pnpm db:push` instead of `pnpm db:migrate`, so nothing was committed.

## Changing the database schema

The schema is version-controlled through migration files, so everyone's database — yours, your
teammates', CI's, and the deployed one — ends up in the same state.

```bash
# 1. Edit backend/prisma/schema.prisma
# 2. Create and apply the migration
pnpm db:migrate --name add_item_table
```

This writes a new folder under `backend/prisma/migrations/`. **Commit it with your PR** — it is
part of the change, not a local artifact. On every deployment Vercel runs `prisma migrate
deploy` before starting the backend, which applies exactly those files.

> [!TIP]
> `pnpm db:reset` returns before PostgreSQL has finished starting. If the next command fails
> with "Can't reach database server", wait a second and run it again.

## How it all fits together

Locally you run three things — the Next.js app on port 3000, the Express API on port 4000 and a
PostgreSQL container on port 5434. Deployed, they become **one Vercel deployment on one
domain**: `/` is the frontend, `/api` is the backend, `/storybook/` is the component library.
Every push builds a preview you can open from the pull request, and the backend build applies
your migrations to the database before the API starts.

[**ARCHITECTURE.md**](./ARCHITECTURE.md) explains all of it: the routing, the environment
variables and who sets them, what happens on every push, and what to do when a check on your PR
goes red.

## Where to go next

- [Frontend README](./frontend/README.md) — Next.js, the component library, Storybook
- [Backend README](./backend/README.md) — Express, Prisma, the REST API
- [Database setup](./backend/POSTGRESQL_SETUP.md) — Docker and the alternatives
- [Architecture](./ARCHITECTURE.md) — how the pieces fit together and how deployment works
- [Contributing](./CONTRIBUTING.md) — how we work as a team: tickets, PRs, reviews, sprints
