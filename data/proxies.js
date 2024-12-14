const fs = require("fs");
const logger = require("../logger/logger");

const validProxyFormat = /^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d{2,5}(,.+)?$/;

/**
 * Selects a random proxy from the proxy file.
 */
function getRandomProxy() {
  const filePath = process.env.PROXY_FILE || "proxies.txt";

  let proxies;
  try {
    proxies = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .filter(Boolean)
      .map((proxy) => {
        if (!validProxyFormat.test(proxy)) {
          logger.warn(`Invalid proxy format skipped: ${proxy}`);
          return null;
        }
        const [server, username, password] = proxy.split(",");
        return {
          server,
          username: username || null,
          password: password || null,
        };
      })
      .filter(Boolean);
  } catch (error) {
    logger.error(`Failed to read proxies file: ${error.message}`);
    proxies = [];
  }

  if (proxies.length === 0) {
    logger.warn("No valid proxies found. Proceeding without proxies.");
    return null;
  }

  return proxies[Math.floor(Math.random() * proxies.length)];
}

module.exports = { getRandomProxy };
