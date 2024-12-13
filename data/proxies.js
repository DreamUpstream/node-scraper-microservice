const fs = require("fs");
const logger = require("../logger/logger");

const validProxyFormat = /^http:\/\/\d{1,3}(\.\d{1,3}){3}:\d{2,5}(,.+)?$/;

function getRandomProxy() {
  const filePath = process.env.PROXY_FILE || "proxies.txt";
  const proxies = fs
    .readFileSync(filePath, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((proxy) => {
      if (!validProxyFormat.test(proxy)) {
        throw new Error(`Invalid proxy format: ${proxy}`);
      }
      const [server, username, password] = proxy.split(",");
      return { server, username: username || null, password: password || null };
    });

  if (proxies.length === 0) {
    throw new Error("Proxy list is empty.");
  }

  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

module.exports = { getRandomProxy };
