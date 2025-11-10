import path from "node:path";
import { createLogger, format, transports, Logger } from "winston";
import type { StackFrame } from "stack-trace";
import * as stackTrace from "stack-trace";
import env from "../config/env.js";

// Type for log levels
type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";

// Levels that should include file name in logs
const fileNameLogLevels: LogLevel[] = ["error", "warn", "info", "http", "verbose", "debug", "silly"];

/**
 * Get the file path of the caller (excluding internal files and node_modules)
 * @returns The relative file path or 'unknown file path' if not found
 */
const getCallerFile = (): string => {
  const trace: StackFrame[] = stackTrace.get();

  for (let i = 0; i < trace.length; i++) {
    const frame = trace[i];
    if (!frame) continue;

    const fileName: string | null = frame.getFileName();

    if (
      fileName &&
      !fileName.includes("node_modules") && // Exclude internal libraries
      !fileName.includes("util/logger") // Exclude the logger itself
    ) {
      // Make the file path relative to the project directory
      return path.relative(process.cwd(), fileName);
    }
  }

  return "unknown file path"; // Fallback if no valid file is found
};

// Check if the current log level requires file name logging
const shouldLogFileName: boolean = fileNameLogLevels.includes(env.debugging.logLevel);

/**
 * Winston logger instance configured with custom formatting
 * Includes timestamp, log level, optional file path, and message
 */
const logger: Logger = createLogger({
  level: env.debugging.logLevel || "info", // Set the logging level from env config
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    format.printf((info) => {
      const timestamp = info.timestamp || "";
      const level = info.level || "";
      const message = info.message || "";

      // Color the log level
      let coloredLevel = level.toUpperCase();
      switch (level) {
        case "error":
          coloredLevel = `\x1b[31m${coloredLevel}\x1b[0m`; // Red
          break;
        case "warn":
          coloredLevel = `\x1b[33m${coloredLevel}\x1b[0m`; // Yellow
          break;
        case "info":
          coloredLevel = `\x1b[32m${coloredLevel}\x1b[0m`; // Green
          break;
        case "http":
          coloredLevel = `\x1b[36m${coloredLevel}\x1b[0m`; // Cyan
          break;
        case "debug":
          coloredLevel = `\x1b[34m${coloredLevel}\x1b[0m`; // Blue
          break;
        case "verbose":
        case "silly":
          coloredLevel = `\x1b[90m${coloredLevel}\x1b[0m`; // Gray
          break;
      }

      // Include the file path if the log level requires it
      const fileName: string | null = shouldLogFileName ? getCallerFile() : null;
      const coloredFileName = fileName ? `\x1b[35m[${fileName}]\x1b[0m` : ""; // Purple file name

      return `${timestamp} [${coloredLevel}]${coloredFileName}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to the console
  ],
});

// If debugging is disabled, suppress all logs
if (!env.debugging.enableDebug) {
  logger.transports.forEach((transport) => {
    transport.silent = true;
  });
}

logger.info("Logger initialized successfully");

export default logger;

/**
 * Example usage:
 *
 * logger.error('This is an error message');   // Logs at the "error" level
 * logger.warn('This is a warning message');   // Logs at the "warn" level
 * logger.info('This is an info message');     // Logs at the "info" level
 * logger.http('This is an HTTP log message'); // Logs at the "http" level
 * logger.verbose('This is a verbose message'); // Logs at the "verbose" level
 * logger.debug('This is a debug message');    // Logs at the "debug" level
 * logger.silly('This is a silly message');    // Logs at the "silly" level
 */
