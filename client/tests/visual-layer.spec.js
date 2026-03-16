import { test, expect } from '@playwright/test';
import { mockSupabase } from './helpers/mockSupabase';

test.describe('3D Visual Layer Tests', () => {

    test('Landing Page: Molecule Animation & Interaction', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: false });
        await page.goto('/');
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        await page.click('.start-button');
        await expect(page).toHaveURL(/.*login/);
    });

    test('Login Page: Interactive Card & Input Access', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: false });
        await page.goto('/login');
        const authCard = page.locator('.auth-card');
        await expect(authCard).toBeVisible();
        await authCard.hover();

        await page.getByTestId('email-input').fill('admin@alchemistry.com');
        await page.getByTestId('password-input').fill('password123');

        // We re-mock with isLoggedIn: true to simulate successful login redirection
        await mockSupabase(page, { isLoggedIn: true, role: 'teacher' });
        await page.getByTestId('login-submit-btn').click();
        await expect(page).toHaveURL(/.*teacher/, { timeout: 10000 });
    });

    test('Dashboard: Interaction', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: true, role: 'teacher' });
        await page.goto('/teacher');
        await expect(page.getByTestId('dashboard-title')).toBeVisible();
        await expect(page.getByTestId('dashboard-title')).toContainText('Dashboard');
    });

    test('Experiment Page: Reactive Beaker Integration', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: true, role: 'student' });
        await page.goto('/student/lab');

        // Wait for 3D environment to start loading
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 15000 });

        const slider = page.locator('input[type="range"]').first();
        await expect(slider).toBeVisible();
    });

    test('Performance: FPS Check (Basic)', async ({ page }) => {
        await mockSupabase(page, { isLoggedIn: false });
        await page.goto('/');

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
        expect(fps).toBeGreaterThan(20);
    });

});
