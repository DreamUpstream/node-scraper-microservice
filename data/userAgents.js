require("dotenv").config();
const fs = require("fs");
const logger = require("../logger/logger");

function getRandomUserAgent() {
  const filePath = process.env.USER_AGENT_FILE || "user-agents.txt";
  const userAgents = fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .filter(Boolean);

  if (userAgents.length === 0) {
    logger.error("User-agent list is empty. Please provide a valid file.");
    throw new Error("User-agent list is empty. Use a valid file.");
  }

  const randomIndex = Math.floor(Math.random() * userAgents.length);
  const userAgent = userAgents[randomIndex];
  logger.info(`Selected User-Agent: ${userAgent}`);
  return userAgent;
}

module.exports = { getRandomUserAgent };
