# Contributing — Team Working Agreement

**Cohort:** around 15 Full Stack students
**Mission:** build one product together, as a team. Teachers guide and answer questions — you own the delivery.

This is how we work. It is not bureaucracy: every rule here exists so that fifteen people can
work on one codebase without blocking each other.

---

## 1. Ticket workflow

- **One ticket in progress at a time, per person.** No parallel work in progress. Finish or hand
  off before picking up the next one.
- **7-day limit per ticket.** If a ticket is not done in 7 days, it gets reassigned to someone
  else on the team. This is not a punishment — it is how we keep the product moving and share
  knowledge.
- **Work in the PR from day one.** Open your pull request as early as possible (a draft PR is
  fine) and push commits daily. A PR should always reflect your current progress — nothing
  should be sitting uncommitted or unpushed on your local machine.

## 2. Collaboration

- **Pair program when you're stuck.** If you cannot figure something out on your own, find a
  teammate and pair. Collaboration is the backbone of a performant team — struggling alone for
  hours helps no one.
- **Blocked by someone else's pending PR?** Say so in the Slack channel. This lets that person
  know someone is waiting on them, and if it is urgent another teammate with time can step in
  and pick up the work.

## 3. Communication

- **Be clear and immediate.** Post in Slack right away when you need a code review or help from
  anyone on the team. Do not sit on a request.
- **Default to public channels** over DMs for anything that affects the team (blockers, review
  requests, decisions) — visibility helps everyone stay in sync.

## 4. Code reviews

- **Reviews are primarily peer-to-peer.** Request reviews from teammates via Slack; do not wait
  on a teacher review to keep moving.
- Teachers will **occasionally** jump into PR reviews to give professional feedback when they
  have spare time — but do not count on it. As volunteers, they are mostly available during
  class time.

## 5. Sprint cadence

- Sprints run **2 weeks**.
- The end of each sprint includes:
  - **Sprint Review** — demo what shipped
  - **Sprint Planning** — pick up the next set of tickets
  - **Retrospective** — what worked, what didn't, what to change

## 6. AI usage

AI tools are **allowed**, with a condition:

- If you are **already comfortable developing on your own**, AI can help you move faster.
- If you are **still learning the fundamentals**, write the code yourself first and use AI as a
  learning aid (explaining concepts, reviewing code you wrote) — not as a replacement for doing
  the work. Skipping that step now will cost you when you are job-hunting and expected to
  actually know how to build things.

---

## Before you ask for a review

Your PR cannot be merged while CI is red, so run the same checks locally first — it is much
faster than waiting for GitHub Actions.

**The quick pass** (catches most failures):

```bash
pnpm lint
pnpm format:check    # or `pnpm format` to fix the formatting
pnpm typecheck
```

**Check the builds pass**, exactly like CI does:

```bash
pnpm build                              # builds the frontend and the backend
pnpm --filter frontend build-storybook  # CI builds Storybook too
```

`pnpm build` is the same `next build` + `tsc` that CI runs, so if it is green locally the CI
build jobs will be green as well. To build only one side while you work:

```bash
pnpm --filter frontend build
pnpm --filter backend build
```

**If you touched `schema.prisma` or the seed**, CI applies the migrations and the seed against a
fresh database — do the same locally before pushing:

```bash
pnpm db:reset    # throws the data away and starts a clean container
pnpm db:deploy   # applies every committed migration from scratch
pnpm db:seed
```

(`pnpm db:reset` returns before PostgreSQL is ready — if `db:deploy` says "Can't reach database
server", wait a second and run it again.)

Your schema change must come with a migration file (`pnpm db:migrate --name ...`, committed
under `backend/prisma/migrations/`). Without one, CI has nothing to apply and the deployed
database never gets your change — see
[Changing the database schema](./README.md#changing-the-database-schema).

| CI job         | Run it locally with                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | `pnpm --filter frontend lint`, then `typecheck`, `build`, `build-storybook`                                           |
| **Backend**    | `pnpm --filter backend lint`, then `typecheck`, `build`, then `pnpm db:deploy` and `pnpm db:seed` on a fresh database |
| **Formatting** | `pnpm format:check` (covers the `frontend` and `backend` files, not the root ones)                                    |

See the [README](./README.md#continuous-integration) for what each CI job checks.

---

## Deployments

Every push deploys: pull requests get a Vercel preview you can open straight from the PR, and
`main` goes to production. The backend build runs `prisma migrate deploy` first, so **the
migrations in your PR are applied automatically** — nobody runs anything by hand against the
deployed database. A migration that fails fails that build, so the broken migration is never
live — but it is recorded as failed and blocks later deployments until a teacher clears it, so
test it against a fresh database first.

Previews share a real database, so flag destructive migrations (dropping or renaming a column
that has data in it) in Slack before you merge.

[**ARCHITECTURE.md**](./ARCHITECTURE.md) has the whole picture — what runs where, which
failures CI catches and which only show up on Vercel, and what to do when a check goes red
(including how to get at a Vercel build log without a Vercel account).

---

## Quick reference

| Rule                | Limit                          |
| ------------------- | ------------------------------ |
| Tickets in progress | 1 per person                   |
| Time per ticket     | 7 days max                     |
| PR updates          | Daily commits, keep it current |
| Blocked?            | Post in Slack immediately      |
| Sprint length       | 2 weeks                        |
