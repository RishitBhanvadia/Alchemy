    // 1. Mock Auth - Session/User
    await page.route('**/auth/v1/user*', async route => {
        console.log(`[MOCK] Auth User: ${route.request().method()} ${route.request().url()}`);
        const method = route.request().method();
        ...
    });

    // 2. Mock Auth - Token/Login
    await page.route('**/auth/v1/token*', async route => {
        console.log(`[MOCK] Auth Token/Login: ${route.request().method()} ${route.request().url()}`);
        ...
    });

    // 3. Mock Database - Profiles
    await page.route('**/rest/v1/profiles*', async route => {
        console.log(`[MOCK] Profiles: ${route.request().method()} ${route.request().url()}`);
        ...
    });

    // 4. Mock Results (Both Express API and Supabase REST)
    await page.route('**/results*', async route => {
        console.log(`[MOCK] Results: ${route.request().method()} ${route.request().url()} - ${route.request().postData()}`);
        ...
    });

    // 6. Mock AI Endpoints
    await page.route('**/api/ai/*', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: { hint: 'Try adding more Acid!', explanation: 'Reaction complete.' } })
        });
    });

    // 7. Inject Fake Session in LocalStorage
    if (isLoggedIn) {
        await page.addInitScript(({ token, email, id, role }) => {
            const fakeSession = {
                access_token: token,
                refresh_token: 'fake-refresh',
                expires_in: 3600,
                token_type: 'bearer',
                user: { id, email, user_metadata: { role }, aud: 'authenticated' }
            };
            localStorage.setItem('supabase.auth.token', JSON.stringify(fakeSession));
        }, { token: 'fake-token', email, id: userId, role });
    }
}
