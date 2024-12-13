require("dotenv").config();
const express = require("express");
const minimist = require("minimist");
const { scrapeWithRetry } = require("./modules/scrapeWithRetry");
const { authenticate } = require("./auth/authMiddleware");
const { validateConfig } = require("./config/validateConfig");
const logger = require("./logger/logger");

validateConfig();

const args = minimist(process.argv.slice(2));
const app = express();
app.use(express.json());

if (args.url) {
  const url = args.url;
  const outputFile =
    args.output || process.env.OUTPUT_FILE || "scraped_page.html";
  const delayRange = [
    args.delayMin || parseInt(process.env.DELAY_MIN || "5"),
    args.delayMax || parseInt(process.env.DELAY_MAX || "10"),
  ];

  scrapeWithRetry(url, outputFile, delayRange).catch((error) =>
    logger.error(error.message)
  );
} else {
  app.post("/scrape", authenticate, async (req, res) => {
    const { url, outputFile, delayMin, delayMax } = req.body;

    if (!url) {
      logger.error("Invalid request: URL is missing.");
      return res.status(400).send({ error: "URL is required" });
    }

    try {
      const content = await scrapeWithRetry(
        url,
        outputFile || process.env.OUTPUT_FILE || "scraped_page.html",
        [
          delayMin || parseInt(process.env.DELAY_MIN || "5"),
          delayMax || parseInt(process.env.DELAY_MAX || "10"),
        ]
      );
      res.send({ success: true, content });
    } catch (error) {
      logger.error(`Error processing URL: ${url}`, error);
      res.status(500).send({ success: false, error: error.message });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Scraping microservice is running on port ${port}`);
  });
}
