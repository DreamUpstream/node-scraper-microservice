# Puppeteer Web Scraper with Stealth and Proxy Support

This project is a customizable Puppeteer-based web scraper that uses dynamic proxies, random user agents, and stealth techniques to evade detection. The scraper reads proxies and user agents from external files specified in the `.env` file. Or takes in command line arguments.

## Features

- **Stealth Mode**: Uses `puppeteer-extra-plugin-stealth` to mimic real browsers and bypass detection.
- **Proxy Rotation**: Supports dynamic proxy rotation for enhanced anonymity.
- **Custom User Agents**: Randomly selects user agents from a provided file for each session.
- **Environment Configuration**: All configuration (URL, file paths, and delay) is managed via the `.env` file.
- **File-Based Inputs**: Reads proxies and user agents from specified text files.
- **Microservice Mode**: Can run as a microservice with an Express.js server.
- **API Key Authentication**: Uses an API key for authentication in microservice mode.

## Quick Start

Run the scraper with the following command to test it:

```bash
node app.js --url=https://example.com --output=test.html --delayMin=1 --delayMax=2
```

- Command-Line Arguments Supported:
  The following arguments are supported in app.js:
  - --url: The URL to scrape.
  - --output: The name of the output file.
  - --delayMin: The minimum delay in seconds between requests.
  - --delayMax: The maximum delay in seconds between requests.

## Project Structure

```

├── auth/
│ └── authMiddleware.js # Authentication middleware
├── config/
│ └── validateConfig.js # Configuration validation script
├── data/
│ ├── proxies.js # Proxies helper script
│ └── userAgents.js # User agents helper script
├── logger/
│ └── logger.js # Logging utility
├── modules/
│ ├── browser.js # Browser setup module
│ ├── captchaSolver.js # CAPTCHA solver placeholder
│ ├── navigation.js # Navigation and scraping module
│ └── scrapeWithRetry.js # Scraping with retry logic
├── scrapers/
│ └── scrapeModule.js # Main scraping module
├── storage/
│ └── scraped_htmls/ # Directory for scraped HTML files
├── utils/
│ ├── captchaDetection.js # CAPTCHA detection utility
│ ├── delay.js # Delay utility script
│ └── storage.js # Storage management utility
├── .env.example # Environment configuration example file
├── app.js # Main application script
├── package.json # Node.js project file
├── proxies.txt # List of proxies
├── user-agents.txt # List of user agents
└── README.md # Project documentation

```

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure Node.js (v20+) is installed.
- **npm**: Comes with Node.js.

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment configuration:
   - Copy the `.env.example` file and rename it to `.env`.
   - Update the configuration values in the `.env` file.
   - Add proxies to the `proxies.txt` file.
   - Add user agents to the `user-agents.txt` file.
   - Update the `URL` value in the `.env` file with the target URL.
   - Update the `DELAY` value in the `.env` file with the delay between requests (in milliseconds).
   - Add your API key to the `.env` file with the key `API_KEY`.
4. Run the scraper:
   ```bash
   npm start
   ```
5. View the scraped data in the console and the `scraped_page.html` file.

### Running as a Microservice

1. Start the Express.js server:
   ```bash
   npm start
   ```
2. Send a POST request to `/scrape` with the following JSON payload and include your API key in the headers:
   ```json
   {
     "url": "<target-url>",
     "outputFile": "scraped_page.html",
     "delayMin": 5,
     "delayMax": 10
   }
   ```
   Headers:
   ```json
   {
     "x-api-key": "<your-api-key>"
   }
   ```
3. The scraped content will be returned in the response and saved to the specified output file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your fork.
4. Create a pull request with a description of your changes.

This is just my small side project, but I hope it can be useful for someone. I'm open to any suggestions or improvements. Feel free to reach out to me if you have any questions or feedback.
