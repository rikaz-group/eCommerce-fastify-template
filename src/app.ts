import path from "node:path";
import { fileURLToPath } from "node:url";
import AutoLoad from "@fastify/autoload";
import { FastifyInstance, FastifyPluginAsync, FastifyServerOptions } from "fastify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppOptions extends FastifyServerOptions {
  // Place your custom options here
}

// Pass --options via CLI arguments in command to enable these options.
export const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify: FastifyInstance, opts: AppOptions): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

export default app;