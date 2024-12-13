const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { getRandomUserAgent } = require("./Scraper/userAgents");
const { getRandomProxy } = require("./proxies");
const { delay } = require("../utils/delay");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");
const { createStoragePath } = require("../utils/storage");

puppeteer.use(StealthPlugin());

async function scrape(url, outputFile, delayRange) {
  let browser;
  try {
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

    browser = await puppeteer.launch({
      headless: true,
      args: proxyConfig.args || [],
    });

    const page = await browser.newPage();

    if (proxyConfig.proxyAuth) {
      await page.authenticate(proxyConfig.proxyAuth);
      logger.info("Proxy authentication successful.");
    }

    await page.setUserAgent(userAgent);
    logger.info("User-Agent set successfully.");

    logger.info(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    const [minDelay, maxDelay] = delayRange;
    logger.info(
      `Waiting for a delay between ${minDelay} and ${maxDelay} seconds.`
    );
    await delay(minDelay * 1000, maxDelay * 1000);

    const dateFolder = createStoragePath();
    const outputPath = path.join(dateFolder, outputFile);
    const content = await page.content();
    fs.writeFileSync(outputPath, content);
    logger.info(`HTML content saved to ${outputPath}`);

    return content;
  } catch (error) {
    logger.error(`Scraping error: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      logger.info("Browser closed.");
    }
  }
}

async function scrapeWithRetry(url, outputFile, delayRange) {
  const retries = parseInt(process.env.RETRY_COUNT || "3");
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info(`Scraping attempt ${attempt} for ${url}`);
      const result = await scrape(url, outputFile, delayRange);
      logger.info("Scraping successful!");
      return result;
    } catch (error) {
      logger.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        logger.error("All retry attempts failed.");
        throw error;
      }
      logger.warn("Retrying after delay...");
      await delay(1000, 3000);
    }
  }
}

module.exports = { scrapeWithRetry };
