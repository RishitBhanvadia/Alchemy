const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to app...');
    // We navigate to a route that is lazy loaded to trigger the suspense fallback
    // Since everything is local, it might be too fast to see.
    // However, the GlobalLoader is the Suspense fallback.
    // We can force it to show by slowing down network or just capturing the very start.

    // Actually, a better way to test the loader appearance is to simulate a slow network
    // or manually render the loader component in isolation if possible,
    // but here we want to see it in the app context.

    await page.goto('http://localhost:3000/lab', { timeout: 60000 });

    // To capture the loader, we might need to intercept the network request for the chunk
    // and delay it, or just take a screenshot immediately.
    // Let's try to take a screenshot immediately after navigation starts but before load completes.

    // Reload to capture loading state
    await page.reload();
    // Wait a tiny bit for React to start rendering the Suspense fallback
    await page.waitForTimeout(100);

    // Take screenshot of the loader
    await page.screenshot({ path: 'verification_screenshots/loader_capture.png' });
    console.log('Screenshot taken: verification_screenshots/loader_capture.png');

    // Also take a screenshot of the loaded page to ensure it still works
    await page.waitForSelector('.lab-page', { timeout: 30000 });
    await page.screenshot({ path: 'verification_screenshots/lab_loaded.png' });
    console.log('Screenshot taken: verification_screenshots/lab_loaded.png');

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();
