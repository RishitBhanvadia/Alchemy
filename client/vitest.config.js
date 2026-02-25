import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        // Only run tests in src/
        include: ['src/**/*.{test,spec}.{js,jsx}'],
        // Explicitly exclude the root tests folder where Playwright specs live
        exclude: [
            'tests/**',
            'node_modules/**',
            'dist/**',
            '**/*.config.js',
            '.idea/**',
            '.git/**',
            '.cache/**',
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
