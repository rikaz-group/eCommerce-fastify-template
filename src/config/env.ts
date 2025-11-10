// Environment configuration
interface DebuggingConfig {
  logLevel: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
  enableDebug: boolean;
}

interface EnvConfig {
  debugging: DebuggingConfig;
}

const env: EnvConfig = {
  debugging: {
    logLevel: (process.env.LOG_LEVEL as DebuggingConfig["logLevel"]) || "silly",
    enableDebug: process.env.ENABLE_DEBUG !== "false", // Default to true
  },
};

export default env;
