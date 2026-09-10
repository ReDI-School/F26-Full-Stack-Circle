# ♻️ ReDiCycle — Frontend

Welcome to the **ReDiCycle** frontend, a [Next.js](https://nextjs.org/) application using the
**App Router**, TypeScript, Tailwind CSS v4 and Storybook.

This folder is a starting point, not a finished app. The structure, tooling and a few example
files are in place — the features are yours to build.

## 📚 What You'll Learn

- **React & Next.js**: components, the App Router, server and client components
- **TypeScript**: typing props and API responses
- **Tailwind CSS v4**: design tokens defined in CSS, utility-first styling
- **tailwind-variants**: building components with variants instead of `if` statements
- **Storybook**: developing and documenting components in isolation
- **Full-Stack Integration**: talking to the backend REST API

## 🏗️ Project Structure

```text
F26-Full-Stack-Circle/
├── frontend/          # Next.js application (what you're looking at!)
├── backend/           # Node.js server with Express and Prisma
└── README.md          # Main project documentation
```

### Frontend Structure (`frontend/` folder)

```text
frontend/
├── src/
│   ├── app/           # App Router — every folder here is a route
│   ├── components/    # Reusable UI components (one folder per component)
│   ├── hooks/         # Custom React hooks
│   ├── assets/        # CSS and images
│   └── config/        # Runtime configuration (API URL, environment)
├── public/            # Static files served as-is (empty for now)
├── .storybook/        # Storybook configuration
├── package.json       # Dependencies and scripts
└── next.config.ts     # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** version 24.0.0 or higher (see `.nvmrc`)
- **pnpm** as the package manager
- Basic understanding of HTML, CSS and JavaScript

### Step 1: Install Dependencies

This repository is a **pnpm workspace**, so dependencies are installed once from the root of
the project — not from inside this folder:

```bash
cd ..
pnpm install
```

### Step 2: Start the Development Server

```bash
cd frontend
pnpm dev
```

Or, from the root of the project: `pnpm start:frontend`.

Open your browser at `http://localhost:3000/`.

> [!NOTE]
> Start the backend server before the frontend so the app has data to show.
> [See Backend README here](../backend/README.md)

## 🎯 How the App Works

### 1. Routing — the App Router (`src/app/`)

In the Next.js App Router, **folders are routes** and a `page.tsx` inside a folder makes that
route render.

```text
src/app/
├── layout.tsx        → wraps every page (html, body, global CSS)
├── page.tsx          → "/"
├── login/
│   └── page.tsx      → "/login"
└── register/
    └── page.tsx      → "/register"
```

To add a page, create a folder and put a `page.tsx` in it. That's the whole routing setup —
there is no route configuration file.

### 2. Layouts (`src/app/layout.tsx`)

The root layout is the shell around every page. It imports the global stylesheets and renders
the shared `Layout` component:

```tsx
const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};
```

### 3. Server and Client Components

By default, components in `src/app/` are **Server Components** — they run on the server and
never ship to the browser. If a component needs `useState`, `useEffect`, `onClick` or any other
browser API, add `'use client';` as the first line of the file.

### 4. Components (`src/components/`)

Every component lives in its own folder and always follows the same five-file shape:

```text
src/components/Button/
├── Button.tsx           # the component itself
├── Button.types.ts      # the props interface
├── Button.styles.ts     # the tailwind-variants styles
├── Button.stories.tsx   # the Storybook stories
└── index.ts             # re-exports, so imports stay short
```

`src/components/index.ts` re-exports every component, which lets you write:

```tsx
import { Button } from '../components';
```

Styles are written with [tailwind-variants](https://www.tailwind-variants.org/), which keeps
the variants of a component in one place:

```ts
export const button = tv({
  base: ['rounded-pill px-6 py-3', 'font-display font-extrabold'],
  variants: {
    variant: {
      primary: 'bg-secondary text-white hover:bg-secondary-hover',
      ghost: 'border-2 border-tertiary text-tertiary',
    },
    stretch: { true: 'w-full' },
  },
  defaultVariants: { variant: 'primary' },
});
```

You then pick the variants when you render: `button({ variant: 'ghost', stretch: true })`.

> [!IMPORTANT]
> The example above is just to show the shape — `Button.styles.ts` in this repo is still
> empty. Filling it in is your first task.

### 5. Styling (`src/assets/css/`)

- `reset.css` — small supplementary reset on top of Tailwind Preflight
- `global.css` — imports Tailwind and declares the **design tokens** in an `@theme` block

Tokens declared in `@theme` become utility classes automatically. A token named
`--color-primary` gives you `bg-primary`, `text-primary`, `border-primary`, and so on. Use the
tokens rather than hard-coded hex values so the whole app stays consistent.

### 6. Configuration (`src/config/`)

The frontend has **no environment file**. The API is always at the relative `/api`:
in production Vercel routes `/api` to the backend service, and in development the rewrite in
`next.config.ts` proxies it to the backend on port 4000. So one URL works everywhere — and because the dev
request goes through the Next.js server, there is no CORS involved either.

```tsx
import { apiUrl } from '../config';

const response = await fetch(apiUrl('/users')); // → /api/users
```

## 🔧 Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Run the production build
pnpm lint             # Check code quality
pnpm typecheck        # Type-check without emitting anything
pnpm format           # Format code with Prettier
pnpm format:check     # Check the formatting without changing anything
pnpm storybook        # Open Storybook (component library)
pnpm build-storybook  # Build a static Storybook
pnpm clean            # Delete .next and storybook-static
```

## 📖 Understanding the Backend

The backend is a Node.js server that provides:

- **REST API endpoints** for user management
- **Database operations** using PostgreSQL and Prisma
- **User authentication** (you will implement this ❤️)

> [!NOTE]
> [See Backend README here](../backend/README.md)

### How Frontend and Backend Connect

1. **Frontend makes a request**: a component calls `fetch(apiUrl('/users'))`, i.e. `/api/users`
2. **Backend receives the request**: the Express server handles the `/users` endpoint
3. **Database query**: Prisma queries the PostgreSQL database
4. **Response**: data is sent back to the frontend
5. **Frontend updates**: `setUsers(data.users)` updates the UI with the received data

## 🧪 Development Tools

### Storybook

Storybook lets you build and test a component in isolation, without wiring it into a page
first. Every component in `src/components/` already has a `.stories.tsx` file, so it shows up
in Storybook from day one.

```bash
pnpm storybook
```

> [!NOTE]
> [See Storybook documentation here](https://storybook.js.org/docs/get-started/install)

### Tests

Vitest, Playwright and the Storybook test addon are installed, but nothing is wired up yet:
there is no `test` script and no Vitest config. Setting that up is one of the tickets.

### ESLint, Prettier and TypeScript

- **ESLint**: finds code quality issues
- **Prettier**: formats your code automatically
- **TypeScript**: catches type errors before they reach the browser

## 🧩 The component library

Every component from the design system already exists as a folder with its five files and a
Storybook story, so you never have to bootstrap one from scratch — open Storybook, pick a
component, and work on it.

| Component        | Variants / props to support                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `Button`         | `variant`: primary, secondary, ghost, danger, outlineLight · `size`: md, sm |
| `TextField`      | default, focus, error                                                       |
| `Select`         | options list, error                                                         |
| `Textarea`       | default, error                                                              |
| `ConditionBadge` | new, like-new, good, used                                                   |
| `CategoryChip`   | default, selected                                                           |
| `CategoryTile`   | tint: primary, secondary, tertiary · selected                               |
| `ItemCard`       | title, price, condition, category, seller, image                            |
| `ShopCard`       | name, item count                                                            |
| `StepCard`       | step number, title, description                                             |
| `Banner`         | `variant`: hero, cta                                                        |
| `Avatar`         | `size`: sm, md, lg · initials or picture                                    |
| `AvatarMenu`     | menu entries, danger entry, dividers                                        |
| `Navbar`         | logged-in and guest states                                                  |
| `Toast`          | `variant`: success, error                                                   |
| `ConfirmDialog`  | title, description, cancel/confirm                                          |
| `Logo`           | ✅ **already built** — your reference example                               |
| `Layout`         | the page shell                                                              |

Each folder is scaffolded but **empty on purpose**: the props, the styles and the markup are
yours to write. Every file says what belongs in it, and the design system tells you how it
should look. Start with the `.types.ts` file (what does this component need to know?), then
the styles, then the markup.

Every component already has a `Default` story with realistic ReDiCycle content in it, plus a
commented-out list of the stories to add as you fill in the props — so you always have
something on screen to work against.

> [!NOTE]
> `Logo` is already built. Read `src/components/Logo/` to see how the five files fit together,
> then build `Button` next — almost every other component uses it, and it is the simplest
> place to get comfortable with `tailwind-variants`.

## 🗺️ The pages to build

Only `/`, `/login` and `/register` exist so far, and they are rough. Here is the full map from
the prototype:

| Route                                    | Screen                                                      |
| ---------------------------------------- | ----------------------------------------------------------- |
| `/`                                      | Home — hero, category tiles, editorial rows, browse results |
| `/login`                                 | Log in                                                      |
| `/register`                              | Register                                                    |
| `/items/[id]`                            | Item detail                                                 |
| `/items/new`                             | Add item                                                    |
| `/shop`                                  | My shop                                                     |
| `/inbox`                                 | Messages                                                    |
| `/admin`                                 | Admin                                                       |
| `/account`                               | Account settings                                            |
| `/how-to-buy`, `/how-to-sell`, `/safety` | Info pages (step cards)                                     |
| `/faq`                                   | FAQ (accordion)                                             |

## 🚀 Next Steps

1. **Build the components**: the folders and stories are scaffolded — fill in the implementations
2. **Add the pages**: create a folder under `src/app/` with a `page.tsx` for each route above
3. **Connect to the backend**: fetch real items instead of the placeholder data
4. **Add user authentication**: implement sign-up and sign-in

## 🆘 Getting Help

1. Check the browser console for error messages
2. Look at the terminal where you ran `pnpm dev`
3. Check the Network tab in browser DevTools to see API calls
4. Review the Next.js and TypeScript documentation

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [tailwind-variants](https://www.tailwind-variants.org/)

---

**Happy coding! 🎉**

This project is designed to grow with you. Start simple, experiment, and don't be afraid to
break things — that's how you learn!
