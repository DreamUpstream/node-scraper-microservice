const fs = require("fs");
const path = require("path");
const winston = require("winston");

// Determine log directory and file
const logDir = path.join(__dirname, "../storage/logs");
const logFilePath = path.join(
  logDir,
  `${new Date().toISOString().split("T")[0]}.log`
);

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Console logging
    new winston.transports.File({
      filename: logFilePath,
      handleExceptions: true,
    }), // File logging
  ],
});

module.exports = logger;
