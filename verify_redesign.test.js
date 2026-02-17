const { test, expect } = require('@playwright/test');

test('Verify Login and Lab Pages', async ({ page }) => {
  // Navigate to Login page
  await page.goto('http://localhost:5173');

  // Verify Login UI changes (labels and inputs)
  await expect(page.getByLabel('Email Address')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();

  // Take screenshot of Login page
  await page.screenshot({ path: 'verification_screenshots/1_login.png' });

  // Perform Login
  await page.getByLabel('Email Address').fill('test@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'ACCESS LAB' }).click();

  // Wait for navigation to Dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  await page.waitForTimeout(1000); // Allow animations to settle
  await page.screenshot({ path: 'verification_screenshots/2_dashboard.png' });

  // Navigate to Lab
  await page.getByText('LABORATORY').click();
  await expect(page).toHaveURL(/.*lab/);

  // Verify Lab UI changes (labels and inputs)
  await expect(page.getByLabel('Conc. HCl')).toBeVisible();
  await expect(page.getByLabel('NaCl')).toBeVisible();
  await expect(page.getByLabel('CuSO4')).toBeVisible();
  await expect(page.getByLabel('FeSO4')).toBeVisible();

  // Take screenshot of Lab page
  await page.screenshot({ path: 'verification_screenshots/3_lab_initial.png' });

  // Interact with Lab inputs
  const slider = page.locator('#range-a');
  await slider.fill('50'); // Simulate range input change
  await page.waitForTimeout(500); // Wait for potential UI updates

  await page.screenshot({ path: 'verification_screenshots/4_lab_interaction.png' });
});
