const fs = require("fs");
const logger = require("../logger/logger");

function validateConfig() {
  const requiredFiles = ["proxies.txt", "user-agents.txt"];
  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing required file: ${file}`);
    }

    const content = fs.readFileSync(file, "utf-8").trim();
    if (!content) {
      throw new Error(`File ${file} is empty. Please provide valid entries.`);
    }
  });

  const requiredEnvVars = ["PORT", "API_KEY"];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  logger.info("Configuration validated successfully.");
}

module.exports = { validateConfig };
