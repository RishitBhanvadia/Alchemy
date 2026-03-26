/**
 * Utility to mock Supabase Auth and Database calls in Playwright
 */
export async function mockSupabase(page, options = {}) {
    const { 
        isLoggedIn = false, 
        role = 'teacher',
        email = 'admin@alchemistry.com',
        userId = '00000000-0000-0000-0000-000000000001'
    } = options;

    // 1. Mock Auth - Session/User
    await page.route('**/auth/v1/user*', async route => {
        const method = route.request().method();
        if (method === 'GET') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: userId,
                    email: email,
                    role: 'authenticated',
                    aud: 'authenticated',
                    app_metadata: { provider: 'email' },
                    user_metadata: { role }
                })
            });
        } else {
            await route.continue();
        }
    });

    // 1b. Mock Auth - session endpoint (often called by getSession if local storage is missing/stale)
    await page.route('**/auth/v1/session*', async route => {
        if (isLoggedIn) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: 'fake-token',
                    token_type: 'bearer',
                    expires_in: 3600,
                    refresh_token: 'fake-refresh',
                    user: {
                        id: userId,
                        email: email,
                        user_metadata: { role },
                        aud: 'authenticated'
                    }
                })
            });
        } else {
            await route.fulfill({ status: 401, body: JSON.stringify({ error: 'unauthorized' }) });
        }
    });

    // 2. Mock Auth - Token/Login (POST)
    await page.route('**/auth/v1/token*', async route => {
        const postData = route.request().postData();
        let currentEmail = email;
        let currentId = userId;
        let currentRole = role;

        if (postData) {
            try {
                const body = JSON.parse(postData);
                if (body.email && body.email.includes('student')) {
                    currentEmail = body.email;
                    currentId = '00000000-0000-0000-0000-000000000002';
                    currentRole = 'student';
                } else if (body.email) {
                    currentEmail = body.email;
                }
            } catch (e) { /* ignore */ }
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                access_token: 'fake-token',
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token: 'fake-refresh',
                user: {
                    id: currentId,
                    email: currentEmail,
                    user_metadata: { role: currentRole },
                    aud: 'authenticated'
                }
            })
        });
    });

    // 3. Mock Database - Profiles
    await page.route('**/rest/v1/profiles*', async route => {
        const accept = route.request().headers()['accept'] || '';
        const isSingle = accept.includes('application/vnd.pgrst.object+json');
        
        const teacher = { id: '00000000-0000-0000-0000-000000000001', role: 'teacher', display_name: 'Dr. Marie Curie' };
        const student = { id: '00000000-0000-0000-0000-000000000002', role: 'student', display_name: 'Alice Student' };
        
        const url = route.request().url();
        const data = url.includes('00000002') ? student : teacher;

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(isSingle ? data : [data])
        });
    });

    // 4. Mock Database - Classrooms
    await page.route('**/rest/v1/classrooms*', async route => {
        const method = route.request().method();
        if (method === 'POST') {
             await route.fulfill({ 
                 status: 201, 
                 contentType: 'application/json', 
                 body: JSON.stringify({ id: '1', class_name: 'Chemistry 101', class_code: 'CHEM101', teacher_id: userId }) 
             });
        } else {
            await route.fulfill({ 
                status: 200, 
                contentType: 'application/json', 
                body: JSON.stringify([{ id: '1', class_name: 'Chemistry 101', class_code: 'CHEM101', teacher_id: userId }]) 
            });
        }
    });

    // 5. Mock Database - Class Memberships
    await page.route('**/rest/v1/class_memberships*', async route => {
        const method = route.request().method();
        if (method === 'POST') {
             await route.fulfill({ status: 201, body: JSON.stringify({ success: true }) });
        } else {
            // Include profile join for teacher view
            const studentId = '00000000-0000-0000-0000-000000000002';
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        student_id: studentId,
                        joined_at: new Date().toISOString(),
                        last_active_at: new Date().toISOString(),
                        profiles: {
                            display_name: 'Alice Student',
                            role: 'student'
                        }
                    }
                ])
            });
        }
    });

    // 6. Mock Database - Results
    await page.route('**/rest/v1/results*', async route => {
        const method = route.request().method();
        if (method === 'POST') {
            await route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify([{ id: 'new-id', outcome_label: 'Success' }])
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        }
    });

    // 7. Mock AI Hint & Results Express API
    await page.route('**/api/*', async route => {
        const url = route.request().url();
        if (url.includes('/results')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ 
                    success: true, 
                    data: [{ outcome_label: 'Reaction Success', color: '#00ff00', product_formula: 'H2O' }] 
                })
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, data: { hint: 'Try adding more Acid!', explanation: 'Reaction complete.' } })
            });
        }
    });

    // 8. Inject Fake Session in LocalStorage
    if (isLoggedIn) {
        await page.addInitScript(({ token, email, id, role }) => {
            try {
                const fakeSession = {
                    access_token: token,
                    refresh_token: 'fake-refresh',
                    expires_in: 3600,
                    token_type: 'bearer',
                    user: { id, email, user_metadata: { role }, aud: 'authenticated' }
                };
                
                // Provide both the v1 and v2 token names to be safe
                localStorage.setItem('supabase.auth.token', JSON.stringify(fakeSession));
                localStorage.setItem('sb-madcquepligcvwkfycud-auth-token', JSON.stringify(fakeSession));
            } catch (e) {
                // Ignore exceptions on about:blank or cross-origin frames
            }
        }, { token: 'fake-token', email, id: userId, role });
    } else {
        await page.addInitScript(() => {
            try {
                localStorage.removeItem('supabase.auth.token');
                localStorage.removeItem('sb-madcquepligcvwkfycud-auth-token');
            } catch (e) {}
        });
    }
}
