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
pnpm db:push     # applies prisma/schema.prisma to the database
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

  async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: number, data: any) {
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

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await this.userService.getUserById(id);
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
      const user = await this.userService.createUser(data);
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
      const user = await this.userService.updateUser(id, data);
      res.json({ user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.userService.deleteUser(id);
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
userRouter.get('/', (req, res) => userController.getAllUsers(req, res));

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

### Creating New Models

Open `prisma/schema.prisma` and add your new model. Here's an example:

```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]   // Relation to Post model
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

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

### 2. Push the changes to the database

```bash
pnpm db:push
```

Or, if you want to create a migration:

```bash
pnpm db:migrate --name your_migration_name
```

> [!NOTE] > `prisma migrate` is Prisma's CLI tool used to manage and apply database schema changes in a structured and version-controlled way. So it will create a new migration file and apply it to the database, keeping your local database in sync with the schema and creating a backup of the previous state of the database to be able to rollback if needed. you can read more about it [here](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Using Models in Your Code

From Prisma 7 on, the client is created once, with a driver adapter, in
`src/libs/prisma.ts` — and the connection URL lives in `prisma.config.ts`, not in
`schema.prisma`. Never call `new PrismaClient()` in a service; import the shared one instead:

```typescript
// src/services/userService.ts
import prisma from '../libs/prisma';

export class UserService {
  async createUser(data: { email: string; name?: string; password: string }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password, // Remember to hash passwords!
      },
    });
  }

  async getUserWithPosts(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true, // Include related posts
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
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and apply migrations
- `pnpm db:studio` - Open Prisma Studio for database management

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build the project
- `pnpm start` - Run the built project
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio for database management

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
