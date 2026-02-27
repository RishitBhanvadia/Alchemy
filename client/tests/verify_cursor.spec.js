const { test, expect } = require('@playwright/test');

test.describe('CursorFollower Verification', () => {
  test('Cursor follower should be visible and move with mouse', async ({ page }) => {
    // Start the local server if not already running (or assume it is on localhost:3000)
    // Wait for the page to load
    await page.goto('http://localhost:3000/lab');

    // Check if the cursor follower elements are in the DOM
    const follower = page.locator('.cursor-follower');
    const dot = page.locator('.cursor-dot');

    await expect(follower).toBeAttached();
    await expect(dot).toBeAttached();

    // Simulate mouse movement
    // Move to 100, 100
    await page.mouse.move(100, 100);

    // Wait for potential animation/frame update
    await page.waitForTimeout(100);

    // Verify style updates
    // The optimized component updates style directly: style="left: 100px; top: 100px;"
    // We check if the style attribute contains the correct values
    const followerStyle = await follower.getAttribute('style');
    const dotStyle = await dot.getAttribute('style');

    console.log('Follower style:', followerStyle);
    console.log('Dot style:', dotStyle);

    expect(followerStyle).toContain('left: 100px');
    expect(followerStyle).toContain('top: 100px');
    expect(dotStyle).toContain('left: 100px');
    expect(dotStyle).toContain('top: 100px');

    // Move to another position
    await page.mouse.move(200, 300);
    await page.waitForTimeout(100);

    const followerStyle2 = await follower.getAttribute('style');
    expect(followerStyle2).toContain('left: 200px');
    expect(followerStyle2).toContain('top: 300px');

    // Take screenshot
    await page.screenshot({ path: 'verification_screenshots/cursor_verification.png' });
  });
});
