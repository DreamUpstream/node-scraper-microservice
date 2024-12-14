const logger = require("../logger/logger");

function ipWhitelist(req, res, next) {
  const allowedIps = (process.env.ALLOWED_IPS || "").split(",");
  const clientIp = req.ip.replace("::ffff:", "");

  if (!allowedIps.includes(clientIp)) {
    logger.error(`Unauthorized IP: ${clientIp}`);
    return res.status(403).send({ error: "Unauthorized IP address." });
  }
  next();
}

module.exports = { ipWhitelist };
