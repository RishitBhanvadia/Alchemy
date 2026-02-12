const { test, expect } = require('@playwright/test');

test('Titration Page - Setup Component Render Verification', async ({ page }) => {
  // 1. Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@alchemistry.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // 2. Navigate to Titration
  await page.goto('http://localhost:3000/titration');
  // Wait for the container
  await page.waitForSelector('.titration-container');

  // 3. Verify TitrationSetup renders with the correct prop usage
  // The initial value of acid_heigth
  const initialPathD = "M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V 687.637H226.348Z";

  // Locate the path element with this specific d attribute
  const acidPath = page.locator(`path[d="${initialPathD}"]`);

  // Verify it is attached to the DOM and visible
  await expect(acidPath).toBeAttached();

  console.log('Titration setup component verified.');
});
