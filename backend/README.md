# Prisma REST API - Learning Project

This project is designed to help students learn backend development using modern technologies. It's a REST API built with TypeScript, Prisma ORM, and Express framework.

## 🚀 Tech Stack

- **TypeScript** - For type-safe code
- **Prisma** - Modern ORM for database operations
- **Express** - Fast, lightweight web framework
- **Node.js** - JavaScript runtime
- **CORS** - Cross-Origin Resource Sharing support
- **Helmet** - Enhanced security headers

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js v24
- pnpm 11+
- Docker (to run the PostgreSQL database)

## 🛠️ Setup

### 1. Install dependencies

This repository is a **pnpm workspace**, so dependencies are installed once from the root of
the project — not from inside this folder:

```bash
cd ..
pnpm install
```

### 2. Start the database

From the root of the project:

```bash
pnpm db:up
```

This starts PostgreSQL in Docker on port **5434**. See
[POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md) if you would rather install PostgreSQL yourself.

### 3. Create your .env file

```bash
cp .env.example .env
```

The connection strings in there already match the Docker database, so there is nothing to edit.

### 4. Create the tables

```bash
pnpm db:deploy   # applies the migrations in prisma/migrations/ to the database
pnpm db:seed     # inserts the seed data
```

## 🏃‍♂️ Running the Project

### Development mode

```bash
pnpm dev
```

### Build and run in production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```bash
src/
├── controllers/    # Business logic handlers
├── routes/         # API route definitions
├── services/       # Business logic and data access
├── libs/          # Shared utilities and helpers
└── index.ts       # Application entry point
```

## 📝 Creating New Endpoints

When creating a new feature, you'll need to create files in multiple directories following the project's architecture. Here's a complete example of creating a user management feature:

### 1. First, create a service in `src/services/userService.ts`

```typescript
// src/services/userService.ts
import prisma from '../libs/prisma';

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: { email: string; name?: string }) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: number, data: { email?: string; name?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
```

### 2. Create a controller in `src/controllers/userController.ts`

```typescript
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const data = req.body;
      const user = await userService.createUser(data);
      res.status(201).json({ user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const user = await userService.updateUser(id, data);
      res.json({ user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await userService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
}
```

### 3. Create a route in `src/routes/userRoutes.ts`

```typescript
// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';

const userRouter = Router();
const userController = new UserController();

// GET /api/users
userRouter.get('/', (req, res) => userController.getUsers(req, res));

// GET /api/users/:id
userRouter.get('/:id', (req, res) => userController.getUserById(req, res));

// POST /api/users
userRouter.post('/', (req, res) => userController.createUser(req, res));

// PUT /api/users/:id
userRouter.put('/:id', (req, res) => userController.updateUser(req, res));

// DELETE /api/users/:id
userRouter.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default userRouter;
```

### 4. Finally, register the route in `src/index.ts`

```typescript
import userRouter from './routes/userRoutes';
api.use('/users', userRouter); // mounted under /api in src/index.ts
```

This structure follows the separation of concerns principle:

- **Services**: Handle business logic and database operations
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and connect them to controllers

The flow of a request is:

1. Request comes to a route
2. Route calls the appropriate controller method
3. Controller uses the service to perform business logic
4. Service interacts with the database through Prisma
5. Response flows back through the same chain

## 🗄️ Database Models and Schemas

The project uses Prisma as its ORM, and all database models are defined in the `prisma/schema.prisma` file. Here's how to work with models:

### The ReDiCycle data model

Nine models, all defined in `prisma/schema.prisma`.

| Model             | What it holds                                                   |
| ----------------- | --------------------------------------------------------------- |
| `User`            | An account: email, name, avatar, role, bcrypt password hash     |
| `Shop`            | One person's shop. Exactly one per account, with a URL `slug`   |
| `Category`        | A browsable category, with the emoji and tint the tiles need    |
| `Item`            | One thing for sale, belonging to a shop                         |
| `ItemImage`       | A photo of an item, ordered by `position` (0 is the main one)   |
| `Thread`          | One conversation about one item, between a buyer and the seller |
| `Message`         | One message inside a thread                                     |
| `HomepageRow`     | A curated row on the homepage, e.g. "fresh finds"               |
| `HomepageRowItem` | One ordered slot in such a row                                  |

And three enums: `Role` (`USER` / `ADMIN`), `Condition`
(`NEW` / `LIKE_NEW` / `GOOD` / `USED`) and `ItemStatus`
(`AVAILABLE` / `SOLD` / `REMOVED`).

#### How the pieces connect

```text
User 1───1 Shop 1───* Item *───1 Category
                       │
                       ├──* ItemImage
                       ├──* Thread *───1 User            (the buyer)
                       │        └──* Message *───1 User  (the sender)
                       └──* HomepageRowItem *───1 HomepageRow
```

#### Things worth knowing before you query

- **Prices are whole cents, in `Int`.** `priceCents: 1800` is €18 — divide by 100 to display
  it. Floats are not safe for money: `0.1 + 0.2` is not `0.3` in binary floating point.
  `originalPriceCents` holds the price before a discount, or `null`; the item detail page
  shows it struck through next to the current one.
- **Items belong to a shop, not to a person.** The seller is one hop further:
  `item.shop.owner`. Cards credit "Lena's shop", which is why it is modelled this way.
- **`REMOVED` is a soft delete.** Deleting an item for real would cascade into the threads
  that reference it and wipe someone's message history, so browse filters on
  `status = AVAILABLE` instead.
- **One thread per buyer per item**, enforced by `@@unique([itemId, buyerId])` on `Thread`.
  Tapping "I'm interested" twice reopens the same conversation rather than starting a
  second one.
- **An unread message has `readAt = null`** — that is the orange dot in the inbox list.
- **Categories are rows, not an enum**, because each one carries an emoji, a tint and a sort
  order, and an admin should be able to add one without a migration. `Condition` and
  `ItemStatus` are enums, because they are fixed labels the code branches on.

### Seeded data and logins

`pnpm db:seed` fills the database with the content drawn in `docs/design/screens`:
5 categories, 4 accounts, 4 shops, 16 items, 4 curated homepage rows and 2 conversations.

Every seeded account shares the same password, hashed with bcrypt exactly as a real
registration will be — so the login form works against them with no special case.

| Email                   | Name     | Shop        | Role    |
| ----------------------- | -------- | ----------- | ------- |
| `lena@redi-school.org`  | Lena K.  | Lena's shop | `ADMIN` |
| `omar@redi-school.org`  | Omar M.  | Omar's shop | `USER`  |
| `mira@redi-school.org`  | Mira S.  | Mira's shop | `USER`  |
| `jonas@redi-school.org` | Jonas B. | Jonas' shop | `USER`  |

**The password for all four is `redicycle123`.**

Log in as `lena@redi-school.org` to reach the admin page — she is the only seeded admin.

> [!WARNING]
> These credentials are for local and preview databases only. Never seed them into anything
> that holds real accounts.

Re-running the seed is safe. Accounts and categories are upserted on their natural keys
(`email`, `slug`), so an account you registered while testing survives; shops, items, rows
and conversations are rebuilt from scratch.

### Creating New Models

Open `prisma/schema.prisma` and add your new model. Here's an example:

```prisma
// prisma/schema.prisma
model Review {
  id        Int      @id @default(autoincrement())
  body      String
  rating    Int
  itemId    Int
  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([itemId])
}
```

> [!NOTE]
> `Review` is only an illustration — it is not part of the schema. The models ReDiCycle
> actually has are listed under
> [The ReDiCycle data model](#the-redicycle-data-model) above.

### Model Features

- **Fields**: Define columns with types and modifiers
- **Relations**: Define relationships between models
- **Modifiers**: Use `@id`, `@unique`, `@default`, etc.
- **Timestamps**: Use `@default(now())` and `@updatedAt`

### Updating the Database

After modifying the schema, you need to update the database:

### 1. Generate the Prisma Client

```bash
pnpm db:generate
```

This writes the typed client to `backend/generated/prisma`. That folder is generated code, so
it is not committed — `pnpm install` recreates it automatically. If imports from
`generated/prisma` suddenly break (typically right after `pnpm clean`), run this command.

### 2. Create a migration

```bash
pnpm db:migrate --name your_migration_name
```

This creates a new folder under `prisma/migrations/` and applies it to your local database.
**Commit that folder with your PR** — CI and the Vercel deployment both run
`prisma migrate deploy`, so a change without a migration file never reaches the deployed
database.

`pnpm db:push` applies the schema without creating a migration file. It is fine for
experimenting on a throwaway local database, but it can silently drop columns and their data,
and it leaves nothing for CI or the deployment to apply.

> [!NOTE] > `prisma migrate` is Prisma's CLI tool used to manage and apply database schema changes in a structured and version-controlled way. So it will create a new migration file and apply it to the database, keeping your local database in sync with the schema and creating a backup of the previous state of the database to be able to rollback if needed. you can read more about it [here](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Using Models in Your Code

From Prisma 7 on, the client is created once, with a driver adapter, in
`src/libs/prisma.ts` — and the connection URL lives in `prisma.config.ts`, not in
`schema.prisma`. Never call `new PrismaClient()` in a service; import the shared one instead:

```typescript
// src/services/userService.ts
import prisma from '../libs/prisma';

export class UserService {
  async createUser(data: { email: string; name?: string }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });
  }

  async getUserWithItems(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        // Items hang off the shop, not off the user directly
        shop: { include: { items: true } },
      },
    });
  }
}
```

### Best Practices

1. **Type Safety**: Use TypeScript types generated by Prisma
2. **Relations**: Define clear relationships between models
3. **Indexes**: Add indexes for frequently queried fields
4. **Validation**: Use Prisma's built-in validation features
5. **Migrations**: Use migrations for production deployments

### Common Commands

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Create and apply a migration (the normal way to change the schema)
- `pnpm db:deploy` - Apply the existing migrations (what CI and Vercel run). Note that this
  does **not** regenerate the Prisma Client: after pulling a branch that changed the schema,
  run `pnpm db:generate` as well, or TypeScript will not see the new models.
- `pnpm db:push` - Push schema changes without a migration file (throwaway databases only)
- `pnpm db:studio` - Open Prisma Studio for database management

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the project
- `pnpm start` - Run the built project
- `pnpm lint` - Check code quality with ESLint
- `pnpm typecheck` - Type-check without emitting anything
- `pnpm format` / `pnpm format:check` - Format the code, or just check it
- `pnpm clean` - Delete `dist/` and `generated/`
- `pnpm db:seed` - Insert the seed data

The database commands are listed under [Common Commands](#common-commands) above.

## 🔒 Security Features

- CORS configuration with environment-based origins
- Helmet.js for secure headers implementation
- Environment variable configuration
- Health check endpoint for monitoring

## 📚 Learning Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.
