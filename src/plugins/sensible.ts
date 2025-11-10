import fp from "fastify-plugin";
import sensible from "@fastify/sensible";
import { FastifyPluginAsync } from "fastify";

/**
 * This plugin adds some utilities to handle HTTP errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
const sensiblePlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(sensible);
});

export default sensiblePlugin;
