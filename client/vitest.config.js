import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        // Explicitly include only src tests to avoid root-level Playwright tests
        include: ['src/**/*.{test,spec}.{js,jsx}'],
        // Exclude root tests folder (typically for Playwright/E2E)
        exclude: [
            'node_modules/**',
            'tests/**',
            'src/test/**',
            '**/*.config.js',
            '**/dist/**',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.config.js',
                '**/dist/**',
            ],
        },
    },
});
