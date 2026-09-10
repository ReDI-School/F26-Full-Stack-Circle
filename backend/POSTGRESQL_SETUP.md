# Database Setup

The project ships with a PostgreSQL database in Docker, so you do not have to install
PostgreSQL on your machine. This is the recommended way.

## Option 1 — Docker (recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Start the database

From the **root** of the project:

```bash
pnpm db:up
```

That reads `docker-compose.yml` and starts a PostgreSQL 18 container named `redicycle-db`:

| Setting  | Value       |
| -------- | ----------- |
| Host     | `localhost` |
| Port     | `5434`      |
| User     | `redi`      |
| Password | `redi`      |
| Database | `redicycle` |

> [!NOTE]
> The container publishes port **5434**, not the usual 5432, so it will not clash with a
> PostgreSQL you may already have running locally.

### Point the backend at it

```bash
cp backend/.env.example backend/.env
```

The `DATABASE_URL` in `.env.example` already matches the container, so there is nothing to
change:

```bash
DATABASE_URL="postgresql://redi:redi@localhost:5434/redicycle"
```

### Create the tables

```bash
pnpm db:push     # applies prisma/schema.prisma to the database
pnpm db:seed     # inserts the seed data
```

### Everyday commands

Run these from the root of the project:

```bash
pnpm db:up       # start the database
pnpm db:down     # stop it (your data is kept)
pnpm db:reset    # delete the data and start over
pnpm db:studio   # open Prisma Studio to browse the data in your browser
```

### Troubleshooting

**`port is already allocated`** — something else is using 5434. Find it with
`docker ps`, or change the host port in `docker-compose.yml` and in your `.env`.

**`Can't reach database server`** — the container is not running. Check with
`docker ps`, and read the logs with `docker logs redicycle-db`.

**The container keeps restarting** — read `docker logs redicycle-db`. If you had an older
PostgreSQL volume around, `pnpm db:reset` will clear it.

## Option 2 — PostgreSQL installed on your machine

If you would rather not use Docker, install PostgreSQL yourself.

### macOS (Homebrew)

```bash
brew install postgresql@18
brew services start postgresql@18
createdb redicycle
```

### Ubuntu / Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb redicycle
```

### Windows

Download the installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
and follow the wizard.

### Then

Put your own connection string in `backend/.env` — note the standard port 5432 here:

```bash
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/redicycle"
```

And create the tables:

```bash
pnpm db:push
pnpm db:seed
```
