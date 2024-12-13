const fs = require("fs");
const path = require("path");
const { isCaptchaPresent } = require("../utils/captcaDetection");
const { handleCaptcha } = require("./captchaSolver");
const logger = require("../logger/logger");
const { createStoragePath } = require("../utils/storage");
const { delay } = require("../utils/delay");

async function navigateAndScrape(page, url, outputFile, delayRange) {
  const [minDelay, maxDelay] = delayRange.map(Number);
  if (minDelay > maxDelay || minDelay < 0) {
    throw new Error("Invalid delay range provided.");
  }

  try {
    logger.info(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });

    if (await isCaptchaPresent(page)) {
      logger.warn("CAPTCHA detected. Attempting to solve...");
      await handleCaptcha(page);
    }

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
    logger.error(`Navigation and scraping failed: ${error.message}`);
    throw error;
  }
}

module.exports = { navigateAndScrape };
