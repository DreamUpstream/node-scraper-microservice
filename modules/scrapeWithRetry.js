const { setupBrowser } = require("./browser");
const { navigateAndScrape } = require("./navigation");
const { delay } = require("../utils/delay");

const logger = require("../logger/logger");

async function scrapeWithRetry(url, outputFile, delayRange) {
  const retries = parseInt(process.env.RETRY_COUNT || "3");

  for (let attempt = 1; attempt <= retries; attempt++) {
    let browser;
    try {
      logger.info(`Scraping attempt ${attempt} for URL: ${url}`);
      const { browser: browserInstance, page } = await setupBrowser();
      browser = browserInstance;

      const content = await navigateAndScrape(
        page,
        url,
        outputFile,
        delayRange
      );
      logger.info("Scraping successful!");
      return content;
    } catch (error) {
      logger.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        logger.error("All retry attempts failed.");
        throw error;
      }
      logger.warn("Retrying after a short delay...");
      await delay(1000, 3000);
    } finally {
      if (browser) {
        await browser.close();
        logger.info("Browser closed.");
      }
    }
  }
}

module.exports = { scrapeWithRetry };
