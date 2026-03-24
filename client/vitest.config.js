import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        exclude: [
            ...configDefaults.exclude,
            'tests/**',
        ],
        server: {
            deps: {
                inline: [/@exodus\/bytes/, /html-encoding-sniffer/]
            }
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.config.js',
                '**/dist/**',
            ],
        },
    },
});
