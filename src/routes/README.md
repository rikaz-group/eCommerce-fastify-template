# Routes Directory

This directory contains your application routes.

## Example Route

```typescript
import { FastifyInstance, FastifyPluginAsync } from "fastify";

const exampleRoute: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/example", async (request, reply) => {
    return { message: "Hello from example route!" };
  });
};

export default exampleRoute;
```

Routes are automatically loaded by `@fastify/autoload` in the main application.
