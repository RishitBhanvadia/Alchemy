import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        // Explicitly include only test files we want Vitest to run (unit tests)
        // and exclude Playwright tests which might match generic patterns.
        include: ['src/**/*.{test,spec}.{js,jsx}'],
        exclude: [
            'node_modules/',
            'src/test/',
            '**/*.config.js',
            '**/dist/**',
            'tests/**', // Exclude the root-level tests folder which contains Playwright specs
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
