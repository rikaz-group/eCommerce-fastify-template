import { FastifyInstance, FastifyPluginAsync } from "fastify";
import logger from "../util/logger.js";

const root: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get("/", async () => {
    logger.info("Hello world from root route");
    return { root: true };
  });

  fastify.get("/health", async () => {
    // Test all log levels
    logger.error("Error level test");
    logger.warn("Warn level test");
    logger.info("Info level test");
    logger.http("HTTP level test");
    logger.verbose("Verbose level test");
    logger.debug("Debug level test");
    logger.silly("Silly level test");

    return { status: "ok", timestamp: new Date().toISOString() };
  });
};

export default root;
