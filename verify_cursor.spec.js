const { test, expect } = require('@playwright/test');

test('CursorFollower Verification', async ({ page }) => {
  // Navigate to the lab page (or any page where CursorFollower is present)
  // Ensure the page is loaded (wait for a key element)
  await page.goto('http://localhost:3000/lab');

  // Wait for the cursor follower elements to be present in the DOM
  const follower = page.locator('.cursor-follower');
  const dot = page.locator('.cursor-dot');

  // They should be present initially (maybe hidden or at 0,0)
  await expect(follower).toBeAttached();
  await expect(dot).toBeAttached();

  // Simulate mouse movement
  // Move to 100, 100
  await page.mouse.move(100, 100);

  // Wait for update (direct DOM update is instant, but let's give it a frame)
  await page.waitForTimeout(100);

  // Check if style attributes reflect the position
  // The optimization uses direct style updates: element.style.left = `${x}px`
  await expect(follower).toHaveAttribute('style', /left: 100px/);
  await expect(follower).toHaveAttribute('style', /top: 100px/);
  await expect(dot).toHaveAttribute('style', /left: 100px/);
  await expect(dot).toHaveAttribute('style', /top: 100px/);

  // Move to another position
  await page.mouse.move(200, 300);
  await page.waitForTimeout(100);

  await expect(follower).toHaveAttribute('style', /left: 200px/);
  await expect(follower).toHaveAttribute('style', /top: 300px/);

  // Take a screenshot for visual confirmation
  await page.screenshot({ path: 'verification_screenshots/cursor_verification.png' });
});
