import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        actionTimeout: 15000,
        launchOptions: {
            args: [
                '--enable-webgl',
                '--use-gl=swiftshader',
                '--disable-web-security',
            ],
        },
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'npm start',
            url: 'http://localhost:5173',
            cwd: './',
            reuseExistingServer: true,
            timeout: 60000,
        },
        {
            command: 'node server.js',
            url: 'http://localhost:5000',
            cwd: '../server',
            reuseExistingServer: true,
            timeout: 60000,
        }
    ],
});
