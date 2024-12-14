const { setupBrowser } = require("./browser");
const { navigateAndScrape } = require("./navigation");
const { delay } = require("../utils/delay");

const logger = require("../logger/logger");

async function scrapeWithRetry(url, outputFile, delayRange) {
  const retries = parseInt(process.env.RETRY_COUNT || "3");
  const retryDelayMin = parseInt(process.env.RETRY_DELAY_MIN || "1000");
  const retryDelayMax = parseInt(process.env.RETRY_DELAY_MAX || "3000");

  for (let attempt = 1; attempt <= retries; attempt++) {
    let browser;
    try {
      logger.info(`Scraping attempt ${attempt}/${retries} for URL: ${url}`);
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
        logger.error(`Retries exhausted after ${retries} attempts for ${url}`);
        throw new Error(
          `All ${retries} retry attempts failed for URL: ${url}. Last error: ${error.message}`
        );
      }
      logger.warn(`Retrying in ${retryDelayMin}-${retryDelayMax}ms...`);
      await delay(retryDelayMin, retryDelayMax);
    } finally {
      if (browser) {
        await browser.close();
        logger.info("Browser closed.");
      }
    }
  }
}

module.exports = { scrapeWithRetry };
