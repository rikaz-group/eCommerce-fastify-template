import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Logger", () => {
  beforeEach(() => {
    // Reset environment variables for testing
    vi.stubEnv("LOG_LEVEL", "silly");
    vi.stubEnv("ENABLE_DEBUG", "true");
  });

  afterEach(() => {
    // Restore environment
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("should create a logger instance with correct log level", async () => {
    const { default: logger } = await import("../logger.js");

    expect(logger).toBeDefined();
    expect(logger.level).toBe("silly");
  });

  it("should have all Winston log methods available", async () => {
    const { default: logger } = await import("../logger.js");

    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.http).toBe("function");
    expect(typeof logger.verbose).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.silly).toBe("function");
  });

  it("should not throw when logging at any level", async () => {
    const { default: logger } = await import("../logger.js");

    expect(() => logger.error("Test error")).not.toThrow();
    expect(() => logger.warn("Test warn")).not.toThrow();
    expect(() => logger.info("Test info")).not.toThrow();
    expect(() => logger.http("Test http")).not.toThrow();
    expect(() => logger.verbose("Test verbose")).not.toThrow();
    expect(() => logger.debug("Test debug")).not.toThrow();
    expect(() => logger.silly("Test silly")).not.toThrow();
  });

  it("should respect log level from environment", async () => {
    vi.stubEnv("LOG_LEVEL", "error");
    vi.resetModules();

    const { default: logger } = await import("../logger.js");

    expect(logger.level).toBe("error");
  });

  it("should silence transports when debugging is disabled", async () => {
    vi.stubEnv("ENABLE_DEBUG", "false");
    vi.resetModules();

    const { default: logger } = await import("../logger.js");

    // Check that all transports are silenced
    logger.transports.forEach((transport) => {
      expect(transport.silent).toBe(true);
    });
  });

  it("should enable transports when debugging is enabled", async () => {
    vi.stubEnv("ENABLE_DEBUG", "true");
    vi.resetModules();

    const { default: logger } = await import("../logger.js");

    // Check that transports are not silenced (silent should not be true)
    logger.transports.forEach((transport) => {
      expect(transport.silent).not.toBe(true);
    });
  });

  it("should have Console transport configured", async () => {
    const { default: logger } = await import("../logger.js");

    expect(logger.transports.length).toBeGreaterThan(0);
    expect(logger.transports[0]?.constructor.name).toBe("Console");
  });

  it("should handle various data types as log messages", async () => {
    const { default: logger } = await import("../logger.js");

    // Test with different types - should not throw
    expect(() => logger.info("String message")).not.toThrow();
    expect(() => logger.info(JSON.stringify({ key: "value" }))).not.toThrow();
    expect(() => logger.info("Number: " + 123)).not.toThrow();
    expect(() => logger.info("Boolean: " + true)).not.toThrow();
  });
});
