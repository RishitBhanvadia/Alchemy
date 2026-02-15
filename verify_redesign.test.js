const { test, expect } = require('@playwright/test');

test('Redesign Verification Tour', async ({ page }) => {
    // 1. Visit Login Page
    console.log('Visiting Login Page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification_screenshots/1_login.png' });

    // 2. Perform Login
    console.log('Logging in...');
    await page.fill('input[type="email"]', 'admin@alchemistry.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 3. Verify Dashboard
    console.log('Waiting for Dashboard...');
    await page.waitForURL('**/dashboard');
    await page.waitForSelector('.module-grid'); // Wait for grid to load
    await page.waitForTimeout(1500); // Wait for fade-in animations
    await page.screenshot({ path: 'verification_screenshots/2_dashboard.png' });

    // 4. Navigate to Lab
    console.log('Navigating to Lab...');
    await page.click('a[href="/lab"]');
    await page.waitForURL('**/lab');
    await page.waitForSelector('.chemical-rack'); // Wait for lab specific element
    await page.waitForTimeout(2000); // Wait for 3D and animations
    await page.screenshot({ path: 'verification_screenshots/3_lab_initial.png' });

    // 5. Interact with Sliders (Simulate Experiment)
    console.log('Interacting with controls...');
    // Force change values of range inputs
    await page.evaluate(() => {
        const setNativeValue = (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(element, value);
            } else {
                valueSetter.call(element, value);
            }
        };

        const inputs = document.querySelectorAll('input[type="range"]');
        if (inputs[0]) {
            setNativeValue(inputs[0], 50);
            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (inputs[1]) {
            setNativeValue(inputs[1], 50);
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification_screenshots/4_lab_interaction.png' });

    // 6. Initiate Reaction
    console.log('Initiating Reaction...');
    await page.click('.action-button'); // "INITIATE REACTION" button

    // 7. Verify Result Page
    console.log('Waiting for Results...');
    await page.waitForURL('**/result');
    await page.waitForSelector('.result-grid');
    await page.waitForTimeout(3000); // Wait for "processing" or data fetch
    await page.screenshot({ path: 'verification_screenshots/5_result.png' });

    console.log('Verification Complete. Check screenshots folder.');
});
