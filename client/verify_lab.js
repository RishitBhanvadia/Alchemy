const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to Lab...');
    await page.goto('http://localhost:5173/lab');

    // Wait for the page to load
    await page.waitForSelector('.lab-page');

    console.log('Lab page loaded.');

    // Find the HCl slider
    // I added id="hcl-input"
    const hclInput = page.locator('#hcl-input');

    // Check initial color of test tube
    // In CustomTestTube: <path id="permanent" fill={color} ... />
    const tubeLiquid = page.locator('#permanent');

    // Drag slider to 50
    console.log('Changing HCl input...');
    await hclInput.evaluate(e => {
      e.value = 50;
      e.dispatchEvent(new Event('change', { bubbles: true }));
      // Also trigger input just in case, though the code uses onChange
      e.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Wait for update
    await page.waitForTimeout(1000);

    // Check new color
    const newFill = await tubeLiquid.getAttribute('fill');
    console.log('New fill:', newFill);

    // Take screenshot
    await page.screenshot({ path: 'verification_lab.png' });
    console.log('Screenshot saved to verification_lab.png');

  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
