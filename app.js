require("dotenv").config();
const express = require("express");
const minimist = require("minimist");
const { scrapeWithRetry } = require("./modules/scrapeWithRetry");
const { authenticate } = require("./auth/authMiddleware");
const { validateConfig } = require("./config/validateConfig");
const { ipWhitelist } = require("./auth/ipWhitelistMiddleware");
const Joi = require("joi");
const rateLimit = require("express-rate-limit");
const logger = require("./logger/logger");
const cors = require("cors");

// Validate the configuration before starting the application.
validateConfig();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use(express.json());
app.use(ipWhitelist);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

const scrapeSchema = Joi.object({
  url: Joi.string().uri().required(),
  outputFile: Joi.string().optional(),
  delayMin: Joi.number().min(0).optional(),
  delayMax: Joi.number().min(0).optional(),
});

const args = minimist(process.argv.slice(2));

if (args.url) {
  // Command-line mode: Run scraper directly
  (async () => {
    const url = args.url;
    const outputFile =
      args.output || process.env.OUTPUT_FILE || "scraped_page.html";
    const delayRange = [
      args.delayMin || parseInt(process.env.DELAY_MIN || "5"),
      args.delayMax || parseInt(process.env.DELAY_MAX || "10"),
    ];

    try {
      logger.info(`Scraping URL: ${url}`);
      const content = await scrapeWithRetry(url, outputFile, delayRange);
      logger.info(`Scraping completed. Output saved to: ${outputFile}`);
    } catch (error) {
      logger.error(`Scraping failed: ${error.message}`);
      process.exit(1); // Exit with failure
    }
    process.exit(0); // Exit successfully after scraping
  })();
} else {
  // Microservice mode: Start the server
  app.post("/scrape", authenticate, ipWhitelist, async (req, res) => {
    const { error } = scrapeSchema.validate(req.body);
    if (error) {
      logger.warn(`Invalid request payload: ${JSON.stringify(req.body)}`);
      return res.status(400).send({ error: error.details[0].message });
    }

    const { url, outputFile, delayMin, delayMax } = req.body;

    try {
      const content = await scrapeWithRetry(
        url,
        outputFile || process.env.OUTPUT_FILE || "scraped_page.html",
        [delayMin || 5, delayMax || 10]
      );
      res.send({ success: true, content });
    } catch (error) {
      logger.error(`Failed to scrape URL: ${url}. Error: ${error.message}`);
      res.status(500).send({ error: "Scraping failed. See logs for details." });
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => logger.info(`Server is running on port ${port}`));
}
