const fs = require("fs");
const path = require("path");
const logger = require("../logger/logger");

function createStoragePath() {
  const baseDir = path.join("storage", "scraped");
  const dateDir = new Date().toISOString().split("T")[0];
  const fullPath = path.join(baseDir, dateDir);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    logger.info(`Created directory for storage: ${fullPath}`);
  }
  return fullPath;
}

module.exports = { createStoragePath };
