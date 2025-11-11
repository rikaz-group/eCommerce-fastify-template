# Prisma Database Setup

This directory contains the Prisma schema and database configuration for the microservice template.

## 📁 Directory Structure

```
prisma/
├── schema.prisma      # Database schema definition
├── migrations/        # Database migration files (auto-generated)
└── README.md         # This file
```

## 🚀 Getting Started

### Initial Setup

The Prisma configuration has already been initialized with PostgreSQL as the database provider. Here's what was done:

```bash
npx prisma init --datasource-provider postgresql
```

This command created:

- `prisma/schema.prisma` - Your database schema file
- `prisma.config.ts` - Prisma configuration (at project root)
- Updated `.env` file with `DATABASE_URL` placeholder

### Environment Variables

Add your PostgreSQL connection string to the `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
```

**Important**: The `.env` file is already in `.gitignore` to prevent committing sensitive credentials.

## 📝 Defining Your Schema

Edit `prisma/schema.prisma` to define your database models. Example:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔧 Essential Prisma Commands

### `npx prisma format`

**Auto-formats your Prisma schema file.**

- Organizes models and fields consistently
- Adds proper indentation and spacing
- Validates schema syntax
- Run this before committing changes to `schema.prisma`

```bash
npx prisma format
```

---

### `npx prisma migrate dev`

**Creates and applies database migrations in development.**

This command performs the following steps:

1. Detects changes in `schema.prisma`
2. Creates a new migration file in `prisma/migrations/`
3. Applies the migration to your database
4. Regenerates Prisma Client with updated TypeScript types

```bash
npx prisma migrate dev --name add_user_model
```

**What happens:**

- ✅ Creates SQL migration files (e.g., `20241110_add_user_model.sql`)
- ✅ Updates your database schema
- ✅ Regenerates `@prisma/client` types
- ✅ Keeps migration history for version control

**When to use:**

- After adding/modifying models in `schema.prisma`
- During local development
- Before pushing code changes

---

### `npx prisma migrate deploy`

**Applies pending migrations in production.**

```bash
npx prisma migrate deploy
```

**Use this in:**

- Production environments
- CI/CD pipelines
- Docker containers

**Note:** Does NOT create new migrations, only applies existing ones.

---

### `npx prisma generate`

**Regenerates Prisma Client after schema changes.**

```bash
npx prisma generate
```

**When to use:**

- After pulling schema changes from Git
- After manual edits to `schema.prisma`
- To update TypeScript types without running migrations

---

### `npx prisma studio`

**Opens a visual database browser in your browser.**

```bash
npx prisma studio
```

- Browse and edit database records
- Test queries visually
- View relationships between tables
- Accessible at `http://localhost:5555`

---

### `npx prisma db push`

**Pushes schema changes directly to the database (without migrations).**

```bash
npx prisma db push
```

**Use cases:**

- Prototyping and rapid development
- Temporary schema changes
- Local development experiments

**⚠️ Warning:** Does not create migration files. Not recommended for production.

---

### `npx prisma db seed`

**Seeds the database with initial data.**

```bash
npx prisma db seed
```

Configure seed script in `package.json`:

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

---

### `npx prisma db pull`

**Introspects an existing database and generates schema.**

```bash
npx prisma db pull
```

Useful when working with an existing database to generate Prisma schema.

---

## 🔄 Typical Development Workflow

1. **Define or update models** in `prisma/schema.prisma`
2. **Format the schema:**
   ```bash
   npx prisma format
   ```
3. **Create and apply migration:**
   ```bash
   npx prisma migrate dev --name descriptive_migration_name
   ```
4. **Use Prisma Client** in your code:

   ```typescript
   import { PrismaClient } from "@prisma/client";
   const prisma = new PrismaClient();

   const users = await prisma.user.findMany();
   ```

## 🏗️ Production Deployment

1. **Build your application:**
   ```bash
   npm run build
   ```
2. **Apply migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🔐 Security Notes

- **Never commit `.env` files** - They contain sensitive database credentials
- Use **environment variables** for production database URLs
- In Docker/Kubernetes, inject `DATABASE_URL` via secrets or ConfigMaps
- The `dotenv` package is included for local development only

## 🐛 Troubleshooting

### Migration conflicts

```bash
npx prisma migrate reset  # ⚠️ Resets database (development only)
```

### Schema drift detection

```bash
npx prisma migrate diff
```

### Clear Prisma cache

```bash
npx prisma generate --force
```

---

**Happy coding! 🚀**
