const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getRandomUserAgent } = require("../data/userAgents");
const { getRandomProxy } = require("../data/proxies");
const logger = require("../logger/logger");

puppeteer.use(StealthPlugin());

/**
 * Sets up a Puppeteer browser with optional proxy and user agent.
 */
async function setupBrowser() {
  const useProxies = process.env.USE_PROXIES === "true";
  const proxy = useProxies ? getRandomProxy() : null;

  const browserArgs = proxy ? [`--proxy-server=${proxy.server}`] : [];
  const userAgent = getRandomUserAgent();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN_PATH || null,
    args: browserArgs,
  });
  const page = await browser.newPage();

  if (proxy && proxy.username && proxy.password) {
    await page.authenticate({
      username: proxy.username,
      password: proxy.password,
    });
    logger.info(`Proxy authentication successful for ${proxy.server}`);
  }

  await page.setUserAgent(userAgent);
  logger.debug("Browser setup completed.");
  return { browser, page };
}

module.exports = { setupBrowser };
