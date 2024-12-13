const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getRandomUserAgent } = require("../data/userAgents");
const { getRandomProxy } = require("../data/proxies");
const logger = require("../logger/logger");

puppeteer.use(StealthPlugin());

async function setupBrowser() {
  const useProxies = process.env.USE_PROXIES === "true";
  let proxyConfig = {};
  if (useProxies) {
    const { server, username, password } = getRandomProxy();
    logger.info(`Using Proxy: ${server}`);
    proxyConfig = {
      args: [`--proxy-server=${server}`],
      proxyAuth: username && password ? { username, password } : null,
    };
  } else {
    logger.info("Proxy usage disabled.");
  }

  const userAgent = getRandomUserAgent();
  logger.info(`Using User-Agent: ${userAgent}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: proxyConfig.args || [],
  });

  const page = await browser.newPage();
  if (proxyConfig.proxyAuth) {
    await page.authenticate(proxyConfig.proxyAuth);
    logger.info("Proxy authentication successful.");
  }
  await page.setUserAgent(userAgent);

  return { browser, page };
}

module.exports = { setupBrowser };
