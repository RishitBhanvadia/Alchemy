// Placeholder for a configuration file that might be needed by Playwright
// Typically Playwright needs a playwright.config.js, but since we're using a single test file we can rely on defaults or pass --config=playwright.config.js if it exists.
// I'll create a minimal config just in case.

const config = {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
  },
};

module.exports = config;
