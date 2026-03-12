import { test, expect } from '@playwright/test';

test('Verify Lab3D Accessibility Improvements', async ({ page }) => {
    // Navigate to the Lab3D page
    await page.goto('/lab-3d');

    // Wait for the chemical levels panel to appear
    await expect(page.locator('.chem-levels-panel')).toBeVisible();

    // Verify the new spans with class label-text are present instead of labels
    const hclSpan = page.locator('span.label-text:has-text("HCl (Clear)")');
    await expect(hclSpan).toBeVisible();

    const naclSpan = page.locator('span.label-text:has-text("NaCl (Green)")');
    await expect(naclSpan).toBeVisible();

    const cuso4Span = page.locator('span.label-text:has-text("CuSO4 (Pink)")');
    await expect(cuso4Span).toBeVisible();

    const feso4Span = page.locator('span.label-text:has-text("FeSO4 (Gold)")');
    await expect(feso4Span).toBeVisible();

    // Verify the aria-live attribute on the warning message
    const warningMsg = page.locator('.note-warn');
    await expect(warningMsg).toHaveAttribute('aria-live', 'polite');
    await expect(warningMsg).toHaveText('Mix at least 2 chemicals');
});
