import { test, expect } from '@playwright/test';

test.describe('Race Condition Reproduction', () => {
    test('Parallel Result Addition to Cart', async ({ context }) => {
        // Create two pages within the same context (sharing localStorage)
        const page1 = await context.newPage();
        const page2 = await context.newPage();

        // Navigate both pages to the lab page
        await page1.goto('/lab');
        await page2.goto('/lab');

        // Clear local storage initially
        await page1.evaluate(() => localStorage.clear());

        // Mock the backend response to ensure deterministic behavior and control timing
        // We'll delay the response slightly to ensure both requests are in-flight simultaneously
        await context.route('**/result/**', async route => {
            const url = route.request().url();
            // Extract params from URL to return unique result
            // URL format: .../result/A/B/C/D
            const parts = url.split('/');
            // The last part is chemD, second to last is chemC, etc.
            // But we just need a unique ID based on inputs.
            // Let's use the whole URL as a key or just generate a random ID based on sum

            // Wait for 2000ms to simulate network latency and ensure the second request starts before the first one finishes
            // The UI has a 1500ms delay before navigation.
            // Page 1 clicks. 1.5s later -> fetch 1 starts.
            // Page 2 clicks. 1.5s later -> fetch 2 starts.
            // We need fetch 1 to be pending when fetch 2 starts?
            // If we click both buttons at the same time, both fetches will start around the same time (1.5s later).
            // So if fetch 1 takes 2s, and fetch 2 takes 2s.
            // They will be in flight together.

            await new Promise(resolve => setTimeout(resolve, 2000));

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{
                    product_name: `Product for ${url}`, // Unique name
                    color: "#00ff00",
                    result: "Reaction complete",
                    solid_color: "#000",
                    gas_color: "#000",
                    gas: "None",
                    solid: "None",
                    product_info: "Test product info",
                    product_properties: ["Prop 1"],
                    product_uses: ["Use 1"]
                }])
            });
        });

        // Set inputs for Page 1 (Chem A = 10)
        // We need to set at least two inputs to non-zero or satisfy the condition `sum >= 2`
        // Wait, onOrNot() checks: if (chemA > 0) sum += 1; ... return sum >= 2;
        // So we need at least TWO chemicals > 0.

        // Page 1: A=10, B=10
        await page1.evaluate(() => {
            const ranges = document.querySelectorAll('input[type="range"]');
            const inputA = ranges[0];
            const inputB = ranges[1];

            // React 16+ hack to trigger onChange
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

            nativeInputValueSetter.call(inputA, 10);
            inputA.dispatchEvent(new Event('input', { bubbles: true }));

            nativeInputValueSetter.call(inputB, 10);
            inputB.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Page 2: A=20, B=20
        await page2.evaluate(() => {
            const ranges = document.querySelectorAll('input[type="range"]');
            const inputA = ranges[0];
            const inputB = ranges[1];

            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

            nativeInputValueSetter.call(inputA, 20);
            inputA.dispatchEvent(new Event('input', { bubbles: true }));

            nativeInputValueSetter.call(inputB, 20);
            inputB.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Click "INITIATE REACTION" button concurrently on both pages
        // The button has class .action-button
        // It should be enabled now.

        await Promise.all([
            page1.click('.action-button'),
            page2.click('.action-button')
        ]);

        console.log('Clicked Initiate on both pages. Waiting for navigation...');

        // Wait for results to load on both pages
        // Navigation takes 1.5s + Network takes 2s = ~3.5s total
        await expect(page1.locator('.result-header')).toBeVisible({ timeout: 10000 });
        await expect(page2.locator('.result-header')).toBeVisible({ timeout: 10000 });

        console.log('Both pages loaded result. Checking localStorage...');

        // Check localStorage in Page 1
        const cart = await page1.evaluate(() => JSON.parse(localStorage.getItem('cart') || '[]'));

        console.log('Final Cart Length:', cart.length);
        console.log('Final Cart Contents:', cart);

        // Should have 2 items if race condition is fixed
        expect(cart.length).toBe(2);
    });
});
