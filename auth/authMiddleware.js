const logger = require("../logger/logger");

function authenticate(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.API_KEY) {
    logger.error("Unauthorized access attempt detected.");
    return res.status(403).send({ error: "Unauthorized. Invalid API Key." });
  }
  next();
}

module.exports = { authenticate };
