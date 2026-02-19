import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        // Exclude Playwright tests which are in the root 'tests' folder
        // Vitest by default looks for files in 'src', but if 'tests' is at root it might pick them up
        // explicitly set include to src and exclude root tests folder if needed
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            'node_modules',
            'dist',
            '.idea',
            '.git',
            '.cache',
            'tests/**', // Exclude Playwright tests
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
