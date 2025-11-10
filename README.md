# Fastify Microservice Template

TypeScript-based Fastify microservice template for the Rikaz Group e-commerce platform using modern ESM modules.

## 🚀 Features

- ✅ **TypeScript** - Full type safety with strict mode enabled
- ✅ **ESM Modules** - Modern JavaScript ES modules (not CommonJS)
- ✅ **Fastify** - Fast and low overhead web framework
- ✅ **Fastify CLI** - Official CLI for development and production
- ✅ **Auto-loading** - Automatic plugin and route registration
- ✅ **Hot Reload** - TypeScript watch + Fastify CLI auto-restart
- ✅ **Production Ready** - Optimized builds (JS only, no source maps)
- ✅ **Structured Logging** - Built-in Pino logger with pretty formatting
- ✅ **Environment Config** - .env support
- ✅ **Health Check** - /health endpoint included

## 📁 Project Structure

```
server-template/
├── src/
│   ├── app.ts              # Main Fastify plugin (entry point)
│   ├── plugins/            # Fastify plugins
│   │   └── sensible.ts     # HTTP error utilities
│   └── routes/             # API routes
│       └── root.ts         # Root & health routes
├── dist/                   # Compiled JavaScript (generated)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript config (development)
├── tsconfig.prod.json      # TypeScript config (production)
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server

```bash
npm run dev
```

Server starts at http://localhost:3000

### 4. Test Endpoints

```bash
curl http://localhost:3000          # { root: true }
curl http://localhost:3000/health   # { status: "ok", timestamp: "..." }
```

## 📦 NPM Scripts

| Script                | Description                                    |
| --------------------- | ---------------------------------------------- |
| npm run dev           | TypeScript watch + Fastify CLI (auto-restart)  |
| npm run dev:tsc       | TypeScript watch only (compiles to dist/)      |
| npm run dev:fastify   | Fastify CLI watch only (watches dist/)         |
| npm run build         | **Production build** (JS only, no source maps) |
| npm run build:dev     | Development build (with .d.ts, .map files)     |
| npm start             | Run production server with Fastify CLI         |
| npm run clean         | Remove dist/ folder                            |
| npm run type-check    | Check TypeScript types without compiling       |
| npm test              | Run tests with Vitest (watch mode)             |
| npm run test:run      | Run tests once (CI mode)                       |
| npm run test:ui       | Run tests with interactive UI                  |
| npm run test:coverage | Generate test coverage report                  |

## 🛠️ Development Workflows

### Recommended: Full Development Mode

```bash
npm run dev
```

- Watches src/ for TypeScript changes
- Compiles to dist/ automatically
- Fastify CLI restarts server on changes
- **Best for development**

### TypeScript Watch Only

```bash
npm run dev:tsc
```

- Only compiles TypeScript in watch mode
- No server restart

### Fastify CLI Watch Only

```bash
npm run dev:fastify
```

- Runs Fastify CLI in watch mode
- Watches dist/ for changes
- Restarts server automatically

## 🏗️ Building for Production

```bash
# Production build (JS only, optimized)
npm run build

# Output: dist/ contains only .js files
dist/
├── app.js
├── plugins/
│   └── sensible.js
└── routes/
    └── root.js
```

### Development Build (with debugging files)

```bash
# Development build (includes .d.ts, .map files)
npm run build:dev

# Output: dist/ contains .js, .d.ts, .map files
dist/
├── app.js
├── app.d.ts
├── app.js.map
├── app.d.ts.map
└── ...
```

## 🔧 Environment Variables

Copy .env.example to .env and configure:

```env
PORT=3000                    # Server port
HOST=0.0.0.0                 # Server host
NODE_ENV=development         # Environment (development/production)
LOG_LEVEL=info               # Logging level (debug/info/warn/error)
DATABASE_URL=postgresql://... # Database connection string
SERVICE_SECRET=secret        # Service-to-service authentication
JWT_SECRET=jwt-secret        # JWT signing secret
```

## 📝 Adding Routes

Create a new route file in src/routes/:

```typescript
// src/routes/products.ts
import { FastifyInstance, FastifyPluginAsync } from "fastify";

const productsRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/products", async (request, reply) => {
    return { products: [] };
  });

  fastify.post("/products", async (request, reply) => {
    return { created: true };
  });
};

export default productsRoute;
```

Routes are automatically loaded by @fastify/autoload.

## 🔌 Adding Plugins

Create a new plugin file in src/plugins/:

```typescript
// src/plugins/database.ts
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const databasePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const prisma = new PrismaClient();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (instance) => {
    await instance.prisma.$disconnect();
  });
});

export default databasePlugin;
```

Plugins are automatically loaded by @fastify/autoload.

## 🌐 ESM Module Configuration

This template uses **ESM (ECMAScript Modules)** instead of CommonJS.

### Key Points

1. **package.json** has "type": "module"
2. **Import syntax** uses ESM:
   ```typescript
   import Fastify from "fastify";
   export default app;
   ```
3. **File extensions** in imports must use .js:
   ```typescript
   import app from "./app.js"; // ✅ (not .ts!)
   ```
4. ****dirname and **filename** don't exist in ESM. Use:

   ```typescript
   import { fileURLToPath } from "node:url";
   import path from "node:path";

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   ```

### Common ESM Issues

**Issue:** Cannot find module './app'  
**Solution:** Add .js extension: import app from "./app.js";

**Issue:** \_\_dirname is not defined  
**Solution:** Use fileURLToPath(import.meta.url) pattern

**Issue:** require is not defined  
**Solution:** Use ESM import instead of require()

## 🛠️ Using This Template for Services

### Create Products Service

```bash
cd /home/adm-services-local/e-commerce
cp -r server-template products-service
cd products-service

# Update package.json name
nano package.json  # Change to "products-service"

npm install
cp .env.example .env
npm run dev
```

### Create Orders Service

```bash
cd /home/adm-services-local/e-commerce
cp -r server-template orders-service
cd orders-service

nano package.json  # Change to "orders-service"
npm install
cp .env.example .env
npm run dev
```

### Create Stripe Service

```bash
cd /home/adm-services-local/e-commerce
cp -r server-template stripe-service
cd stripe-service

nano package.json  # Change to "stripe-service"
npm install
cp .env.example .env
npm run dev
```

### Create Auth Service

```bash
cd /home/adm-services-local/e-commerce
cp -r server-template auth-service
cd auth-service

nano package.json  # Change to "auth-service"
npm install
cp .env.example .env
npm run dev
```

## 🐳 Docker Deployment

Create a Dockerfile in your service:

```dockerfile
FROM node:24-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code
COPY dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
# Build production code
npm run build

# Build Docker image
docker build -t my-service .

# Run container
docker run -p 3000:3000 --env-file .env my-service
```

## 📊 Default Endpoints

| Method | Path    | Description                                 |
| ------ | ------- | ------------------------------------------- |
| GET    | /       | Root endpoint (returns { root: true })      |
| GET    | /health | Health check (returns status and timestamp) |

## 🧪 Testing

This template uses **Vitest** for testing.

### Running Tests

```bash
# Watch mode (runs on file changes)
npm test

# Run once (CI mode)
npm run test:run

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Test Structure

Tests are located in `src/**/__tests__/` directories:

```
src/
└── util/
    ├── logger.ts
    └── __tests__/
        └── logger.test.ts
```

### Writing Tests

```typescript
import { describe, it, expect } from "vitest";

describe("MyModule", () => {
  it("should do something", () => {
    expect(true).toBe(true);
  });
});
```

### Example: Logger Tests

The logger utility includes comprehensive tests:

- Instance creation and configuration
- All log levels (error, warn, info, http, verbose, debug, silly)
- Environment variable configuration
- Transport silencing
- Error handling

## 🔐 Service-to-Service Authentication

For internal endpoints, add authentication middleware:

```typescript
// src/middleware/service-auth.ts
import { FastifyRequest, FastifyReply } from "fastify";

export async function serviceAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["x-service-token"];

  if (token !== process.env.SERVICE_SECRET) {
    reply.code(403).send({ error: "Forbidden" });
  }
}

// Usage in routes
fastify.post(
  "/internal/reserve-stock",
  {
    preHandler: serviceAuth,
  },
  async (request, reply) => {
    // Protected endpoint
  }
);
```

## 📚 Additional Resources

- [Fastify Documentation](https://www.fastify.io/)
- [Fastify CLI Documentation](https://github.com/fastify/fastify-cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma ORM](https://www.prisma.io/) (recommended for database)
- [Pino Logger](https://getpino.io/)

## 🤝 Contributing

This template is maintained by the Rikaz Group development team.

For service-specific changes, create a PR to your service repository.  
For template improvements, create a PR to this repository.

## 📄 License

MIT

---

**Happy Coding! 🎉**
