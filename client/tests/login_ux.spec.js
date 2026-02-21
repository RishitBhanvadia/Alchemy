const { test, expect } = require('@playwright/test');

test('Login button shows loading state', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:5173/login');

  // Intercept authentication requests to simulate delay
  await page.route('**/auth/v1/**', async (route) => {
    // Delay the request by 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Continue the request (even if it fails, we want to see the loading state)
    await route.continue();
  });

  // Fill in the login form
  await page.getByLabel('Email Address').fill('test@example.com');
  await page.getByLabel('Password').fill('password');

  // Click the login button
  await page.getByRole('button', { name: 'ACCESS LAB' }).click();

  // Check that the button text changes to "INITIALIZING..."
  const button = page.getByRole('button', { name: 'INITIALIZING...' });
  await expect(button).toBeVisible();
  await expect(button).toBeDisabled();

  // Take a screenshot of the loading state
  await page.screenshot({ path: 'verification_screenshots/loading_state.png' });
});
