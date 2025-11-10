# Plugins Directory

This directory contains Fastify plugins that provide reusable functionality across your application.

## Example Plugin

```typescript
import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";

const myPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Your plugin code here
});

export default myPlugin;
```

Plugins are automatically loaded by `@fastify/autoload` in the main application.
