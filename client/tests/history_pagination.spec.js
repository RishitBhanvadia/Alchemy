const { test, expect } = require('@playwright/test');

test.describe('History Page Pagination', () => {

    test('Loads large dataset with pagination', async ({ page }) => {

        // --- 1. SETUP MOCK DATA (50 items) ---
        const mockData = Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            user_id: 'test-user-id',
            experiment_type: 'Titration',
            score: 85 + (i % 15),
            details: { molarity: 0.5, volume: 20 },
            created_at: new Date(Date.now() - i * 100000).toISOString()
        }));

        // --- 2. INTERCEPT NETWORK REQUEST ---
        await page.route('**/rest/v1/experiment_results*', async (route) => {
            const url = new URL(route.request().url());
            const offsetHeader = route.request().headers()['range'];
            // Supabase client might send Range header OR params.
            // supabase-js v2 uses Range header usually, or `offset` & `limit` params.
            // Let's check headers first, if not check params.
            // Actually, `supabase-js` usually sends `Range: bytes=x-y` or `x-y`.
            // Let's log it if unsure, but for mocking, we can check `offset` param if sent,
            // or just parse the `Range` header if present.

            // However, the `supabase-js` library translates `.range(from, to)` into a `Range` header
            // or query params `offset` and `limit`.
            // Let's assume standard PostgREST behavior which uses `Range` header or `offset/limit`.

            // To be robust, let's just return the slice based on requested range if we can detect it.
            // If we can't detect it easily in mock, we might just return the whole thing?
            // NO, if we return whole thing, the frontend might render whole thing if it doesn't slice it.
            // BUT my code does `setExperiments(prev => [...prev, ...data])`.
            // So if API returns 50 items for page 0, it renders 50.
            // So the MOCK MUST RESPECT THE RANGE.

            // Let's inspect how `supabase-js` sends range.
            // Usually `Range: 0-19`.
            const rangeHeader = route.request().headers()['range'] || route.request().headers()['Range'];

            if (url.searchParams.get('select') === '*' && url.searchParams.get('order') === 'created_at.desc') {
                let start = 0;
                let end = mockData.length - 1;

                if (rangeHeader) {
                    // format: "0-19" or "bytes=0-19" (PostgREST uses unitless usually?)
                    // Actually PostgREST expects `Range-Unit: items` and `Range: 0-19`.
                    // Let's try to parse "0-19".
                    const parts = rangeHeader.split('-');
                    if (parts.length === 2) {
                        start = parseInt(parts[0]);
                        end = parseInt(parts[1]);
                    }
                } else if (url.searchParams.has('offset') && url.searchParams.has('limit')) {
                    start = parseInt(url.searchParams.get('offset'));
                    const limit = parseInt(url.searchParams.get('limit'));
                    end = start + limit - 1;
                }

                // Adjust end if out of bounds
                if (end >= mockData.length) end = mockData.length - 1;

                const slice = mockData.slice(start, end + 1); // slice end is exclusive

                // Content-Range header is vital for some clients, but maybe not strictly required for `data` extraction
                // if we just return JSON body.
                // But let's return it to be nice.

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    headers: {
                        'Content-Range': `${start}-${end}/${mockData.length}`
                    },
                    body: JSON.stringify(slice)
                });
            } else {
                await route.continue();
            }
        });

        // --- 3. NAVIGATE TO PAGE ---
        await page.goto('http://localhost:3000/login');
        await page.fill('input[type="email"]', 'admin@alchemistry.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('.login-button');
        await expect(page).toHaveURL(/.*dashboard/);

        await page.goto('http://localhost:3000/history');

        // --- 4. VERIFY INITIAL LOAD (Page 0) ---
        const rows = page.locator('.history-table tbody tr');
        await expect(rows.first()).toBeVisible();

        // Should satisfy range 0-19 (20 items)
        await expect(rows).toHaveCount(20);
        console.log('Verified initial load: 20 items');

        // Verify "Load More" button is visible
        const loadMoreBtn = page.locator('.load-more-btn');
        await expect(loadMoreBtn).toBeVisible();
        await expect(loadMoreBtn).toBeEnabled();

        // --- 5. LOAD PAGE 1 ---
        await loadMoreBtn.click();

        // Should have 40 items now
        await expect(rows).toHaveCount(40);
        console.log('Verified page 1 load: 40 items');

        // Button still visible (we have 50 total)
        await expect(loadMoreBtn).toBeVisible();

        // --- 6. LOAD PAGE 2 ---
        await loadMoreBtn.click();

        // Should have 50 items now
        await expect(rows).toHaveCount(50);
        console.log('Verified page 2 load: 50 items');

        // Button should disappear because we reached end
        // (Last fetch returned 10 items, which is < 20)
        await expect(loadMoreBtn).toBeHidden();

    });
});
