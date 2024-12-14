const fs = require("fs");
const logger = require("../logger/logger");

const DEFAULTS = {
  PROXY_FILE: "proxies.txt",
  USER_AGENT_FILE: "user-agents.txt",
  RETRY_COUNT: 3,
};

/**
 * Validates required configuration files and environment variables.
 */
function validateConfig() {
  const requiredFiles = [DEFAULTS.PROXY_FILE, DEFAULTS.USER_AGENT_FILE];

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      const message = `Missing required file: ${file}`;
      logger.error(message);
      throw new Error(message);
    }

    const content = fs.readFileSync(file, "utf-8").trim();
    if (!content) {
      const message = `File ${file} is empty. Please provide valid entries.`;
      logger.error(message);
      throw new Error(message);
    }
  });

  const requiredEnvVars = ["PORT", "API_KEY", "RETRY_COUNT"];

  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      const message = `Missing required environment variable: ${key}`;
      logger.error(message);
      throw new Error(message);
    }
  });

  logger.info("Configuration validated successfully.");
}

module.exports = { validateConfig, DEFAULTS };
