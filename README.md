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

### 3. Create your environment files

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

The defaults already match the Docker database, so there is nothing to edit.

### 4. Create the tables and add the seed data

```bash
pnpm db:push
pnpm db:seed
```

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

| Command               | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `pnpm install`        | Install every dependency, frontend and backend                  |
| `pnpm start:all`      | Run the frontend and the backend together                       |
| `pnpm start:frontend` | Run only the frontend                                           |
| `pnpm start:backend`  | Run only the backend                                            |
| `pnpm storybook`      | Open Storybook, the component library                           |
| `pnpm build`          | Build both projects                                             |
| `pnpm typecheck`      | Type-check both projects                                        |
| `pnpm db:up`          | Start the PostgreSQL container                                  |
| `pnpm db:down`        | Stop it (your data is kept)                                     |
| `pnpm db:reset`       | Delete the data and start over                                  |
| `pnpm db:push`        | Apply `schema.prisma` to the database                           |
| `pnpm db:seed`        | Insert the seed data                                            |
| `pnpm db:studio`      | Browse the data in Prisma Studio                                |
| `pnpm lint`           | Lint both projects                                              |
| `pnpm format`         | Format both projects with Prettier                              |
| `pnpm format:check`   | Check formatting without changing anything                      |
| `pnpm clean`          | Delete build output and `node_modules`, then run `pnpm install` |

> [!TIP]
> To run a command inside one workspace only, use `--filter`:
> `pnpm --filter frontend build`

## Continuous Integration

Every pull request is checked automatically by GitHub Actions
(`.github/workflows/ci.yml`). Three jobs run in parallel:

| Job            | What it checks                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | lint, typecheck, `next build`, and that Storybook still builds                                                      |
| **Backend**    | lint, typecheck, `tsc` build, then applies your Prisma schema and runs the seed against a real throwaway PostgreSQL |
| **Formatting** | that everything is formatted with Prettier                                                                          |

**Your pull request cannot be merged while any of these are red.**

You can run exactly the same checks locally before you push — this is much faster than
waiting for CI:

```bash
pnpm lint
pnpm format:check    # or `pnpm format` to fix the formatting
pnpm --filter frontend typecheck
pnpm --filter backend typecheck
```

> [!TIP]
> If the Backend job fails on "Apply the schema to the database", it usually means
> `schema.prisma` has a change that does not apply cleanly. Try `pnpm db:reset` followed by
> `pnpm db:push` locally to reproduce it.

## Where to go next

- [Frontend README](./frontend/README.md) — Next.js, the component library, Storybook
- [Backend README](./backend/README.md) — Express, Prisma, the REST API
- [Database setup](./backend/POSTGRESQL_SETUP.md) — Docker and the alternatives
