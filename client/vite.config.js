import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': { // Adjust this if your API calls don't start with /api but strictly rely on the root
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: 'build',
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,jsx}'],
        exclude: ['**/node_modules/**', 'tests/**', '**/e2e/**', '**/playwright-tests/**', '**/*.spec.js'],
        setupFiles: './src/test/setup.js',
    },
});
