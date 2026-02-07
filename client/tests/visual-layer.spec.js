const { test, expect } = require('@playwright/test');

test.describe('3D Visual Layer Tests', () => {

    test('Landing Page: Molecule Animation & Interaction', async ({ page }) => {
        // 1. Load Page
        await page.goto('http://localhost:3000/');

        // 2. Verify Canvas Exists
        const canvas = page.locator('canvas'); // The canvas inside CanvasContainer
        await expect(canvas).toBeVisible();

        // 3. functional check: Button works
        await page.click('.start-button');
        await expect(page).toHaveURL(/.*login/);
    });

    test('Login Page: Holographic Tilt & Input Access', async ({ page }) => {
        await page.goto('http://localhost:3000/login');

        // 1. Verify Tilt Container
        const tiltCard = page.locator('.tilt-card');
        await expect(tiltCard).toBeVisible();

        // 2. Hover effect (Functionality check: ensure no errors on hover)
        await tiltCard.hover();

        // 3. Crucial: Input Interaction
        const emailInput = page.locator('input[type="email"]');
        await emailInput.click();
        await emailInput.fill('test@student.com');
        await expect(emailInput).toHaveValue('test@student.com');

        // 4. Submit
        await page.click('.login-button');
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('Dashboard: Non-Blocking Particles', async ({ page }) => {
        await page.goto('http://localhost:3000/dashboard');

        // 1. Verify Canvas styling for pointer-events
        // Note: CanvasContainer puts style on the wrapper div
        const canvasWrapper = page.locator('div[style*="pointer-events: none"]');
        await expect(canvasWrapper).toBeVisible();

        // 2. Verify interactive elements behind canvas are clickable
        const experimentCard = page.locator('.experiment-card').first();
        await expect(experimentCard).toBeVisible();

        // This click would fail if the canvas was blocking
        await experimentCard.click();

        // Should navigate (check URL or some change)
        // The first card goes to /titration
        await expect(page).toHaveURL(/.*titration/);
    });

    test('Experiment Page: Reactive Beaker Integration', async ({ page }) => {
        await page.goto('http://localhost:3000/lab');

        // 1. Verify 3D Beaker canvas exists
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        // 2. Verify existing logic controls (range inputs)
        const sliderA = page.locator('input[name="a"]');
        await expect(sliderA).toBeVisible();

        // 3. Interact to trigger state change (which drives the animation status)
        // Changing the slider updates state in Lab.js -> updates 'experimentStatus' -> updates <ReactiveBeaker>
        await sliderA.fill('50');
        // Note: Visual validation of the color change requires snapshot comparison which is complex to set up in one go.
        // For now, we verify the app doesn't crash and functionality remains.
    });

    test('Performance: FPS Check (Basic)', async ({ page }) => {
        await page.goto('http://localhost:3000/dashboard');

        // Evaluate FPS using requestAnimationFrame loop
        const fps = await page.evaluate(async () => {
            return new Promise(resolve => {
                let frames = 0;
                const startTime = performance.now();

                function loop() {
                    frames++;
                    const currentTime = performance.now();
                    if (currentTime - startTime >= 1000) {
                        resolve(frames);
                    } else {
                        requestAnimationFrame(loop);
                    }
                }
                requestAnimationFrame(loop);
            });
        });

        console.log(`Measured FPS: ${fps}`);
        expect(fps).toBeGreaterThan(30);
    });

});
