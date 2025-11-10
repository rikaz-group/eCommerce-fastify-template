# Testing Guide

## Overview

This template uses **Vitest** for unit and integration testing. Vitest is faster than Jest and has better ESM/TypeScript support.

## Running Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Run once (CI mode)
npm run test:run

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## Test Structure

Tests are co-located with source files in `__tests__` directories:

```
src/
├── util/
│   ├── logger.ts
│   └── __tests__/
│       └── logger.test.ts
├── routes/
│   ├── root.ts
│   └── __tests__/
│       └── root.test.ts
└── plugins/
    ├── sensible.ts
    └── __tests__/
        └── sensible.test.ts
```

## Writing Tests

### Basic Test

```typescript
import { describe, it, expect } from "vitest";

describe("Calculator", () => {
  it("should add two numbers", () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Testing Fastify Routes

```typescript
import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import myRoute from "../my-route.js";

describe("MyRoute", () => {
  it("should return 200 on GET /", async () => {
    const app = Fastify();
    await app.register(myRoute);

    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ success: true });

    await app.close();
  });
});
```

### Testing with Mocks

```typescript
import { describe, it, expect, vi } from "vitest";

describe("Service", () => {
  it("should call external API", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: "mocked" }),
    });

    global.fetch = mockFetch;

    // Test your code
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com");
  });
});
```

### Testing with Environment Variables

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Config", () => {
  beforeEach(() => {
    vi.stubEnv("API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules(); // Re-import modules with fresh env
  });

  it("should use environment variable", async () => {
    const { default: config } = await import("../config.js");
    expect(config.apiKey).toBe("test-key");
  });
});
```

## Configuration

Vitest configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: ["node_modules/", "dist/", "test/**"], // Exclude old CommonJS tests
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "test/"],
    },
  },
});
```

## Best Practices

### 1. Test File Naming

- Test files: `*.test.ts` or `*.spec.ts`
- Location: `__tests__/` directory next to source file

### 2. Test Organization

```typescript
describe("Feature", () => {
  describe("Subfeature", () => {
    it("should do something specific", () => {
      // Test
    });
  });
});
```

### 3. Setup and Teardown

```typescript
beforeEach(() => {
  // Run before each test
});

afterEach(() => {
  // Run after each test
});

beforeAll(() => {
  // Run once before all tests
});

afterAll(() => {
  // Run once after all tests
});
```

### 4. Async Tests

```typescript
it("should handle async operations", async () => {
  const result = await fetchData();
  expect(result).toBe("data");
});
```

### 5. Error Testing

```typescript
it("should throw error for invalid input", () => {
  expect(() => {
    throwError();
  }).toThrow("Invalid input");
});
```

## Example: Logger Tests

See `src/util/__tests__/logger.test.ts` for a complete example:

- ✅ Instance creation
- ✅ Log level configuration
- ✅ All log methods (error, warn, info, http, verbose, debug, silly)
- ✅ Environment variable handling
- ✅ Transport configuration
- ✅ Error handling

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "24"
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

## Coverage Reports

After running `npm run test:coverage`, view the report:

```bash
# Terminal output
# View detailed HTML report
open coverage/index.html
```

## Tips

1. **Keep tests focused** - One assertion per test when possible
2. **Use descriptive names** - Test names should explain what they test
3. **Mock external dependencies** - Don't call real APIs in tests
4. **Test edge cases** - Empty arrays, null values, errors
5. **Keep tests fast** - Avoid unnecessary delays or waits

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Testing Fastify](https://www.fastify.io/docs/latest/Guides/Testing/)
