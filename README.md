# Product Hunt Clone

A full-stack Product Hunt-style app for discovering and sharing new products. Built with Next.js, React, and a PostgreSQL database (Neon).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via [Neon](https://neon.tech) (`@neondatabase/serverless`)
- **Auth:** JWT stored in httpOnly cookies, bcrypt password hashing
- **Validation:** Joi
- **Styling:** Tailwind CSS (CDN)

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. Neon)

### Installation

```bash
npm install
```

### Database setup

1. Create a PostgreSQL database (e.g. on [Neon](https://neon.tech)).
2. Apply the schema migration:

```bash
psql "$DATABASE_URL" -f migrations/001_init.sql
```

Or paste the contents of `migrations/001_init.sql` into the Neon SQL editor and run it.

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_neon_postgres_connection_string
JWT_SECRET=your_jwt_secret
```

| Variable       | Description                         |
| -------------- | ----------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `JWT_SECRET`   | Secret key for signing JWT tokens   |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Features

- User registration and login
- JWT-based authentication with httpOnly cookies
- Protected submit page via middleware (`/products/new`)
- Global header with logo and user menu (login / avatar dropdown)
- Client-side auth state via `useUserAuth` hook
- Profile management API
- Product creation and browse pages
- Product API routes for listing, creating, viewing, updating, and deleting products

## Project Structure

```text
migrations/              # SQL schema migrations
src/
  app/                    # Next.js App Router pages and API routes
    (auth)/               # Login and register pages
    api/                  # API endpoints
    products/             # Product pages
  components/
    auth/                 # LoginForm, RegisterForm
    comments/             # CommentForm, CommentList
    layout/               # Header, UserMenu, ContentContainer
    products/             # ProductList, ProductCard, forms, buttons
    ui/                   # Button, Input, Avatar
  hooks/
    user-auth.tsx         # Auth provider and useUserAuth hook
  lib/
    api/                  # API helpers (withAuth, responses)
    auth/                 # JWT, cookies, password hashing
    queries/              # Database query functions
    validations/          # Joi schemas
  middleware.ts           # Route protection
  types/                  # TypeScript types
```

## API Routes

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| POST   | `/api/auth/register`             | Create a new account     |
| POST   | `/api/auth/login`                | Log in                   |
| POST   | `/api/auth/logout`               | Log out                  |
| GET    | `/api/auth/me`                   | Get current user profile |
| PATCH  | `/api/auth/me`                   | Update profile           |
| PATCH  | `/api/auth/me/password`          | Change password          |
| GET    | `/api/products`                  | List products            |
| POST   | `/api/products`                  | Create a product         |
| GET    | `/api/products/[id]`             | Get product by id        |
| PATCH  | `/api/products/[id]`             | Update owned product     |
| DELETE | `/api/products/[id]`             | Delete owned product     |
| POST   | `/api/products/[id]/upvote`     | Toggle upvote            |
| GET    | `/api/products/[id]/comments`   | List comments            |
| POST   | `/api/products/[id]/comments`   | Add a comment            |
| GET    | `/api/tags`                      | List tags                |

## Database

Schema lives in `migrations/001_init.sql`. Apply it once when setting up a new database (see [Database setup](#database-setup)).

| Table | Purpose |
| ----- | ------- |
| **users** | Accounts (`name`, `username`, `email`, `password`, `avatar_url`, `is_admin`) |
| **products** | Listings (`name`, `slug`, `tagline`, `description`, `url`, `logo_url`, `user_id`) |
| **upvotes** | One vote per user/product; used for ranking (`UNIQUE (user_id, product_id)`) |
| **comments** | Discussion threads on a product (`user_id`, `product_id`, `body`) |
| **tags** | Discoverable categories (`name`, `slug`) |
| **product_tags** | Many-to-many link between products and tags |
| **blacklisted_jwts** | Invalidated tokens after logout |

Foreign keys cascade on delete where appropriate (e.g. deleting a product removes its upvotes, comments, and tag links).

## License

Private project.
