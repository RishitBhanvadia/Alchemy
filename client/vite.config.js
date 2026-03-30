import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path, // do not rewrite — keep /api prefix
            },
        },
    },
    build: {
        outDir: 'build',
        target: 'es2020',
        minify: 'esbuild',
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('three-mesh-bvh')) {
                            return 'vendor-three-bvh';
                        }
                        if (id.includes('three')) {
                            return 'vendor-three';
                        }
                        if (id.includes('@react-three')) {
                            return 'vendor-r3f';
                        }
                        if (id.includes('framer-motion') || id.includes('gsap')) {
                            return 'vendor-animation';
                        }
                        return 'vendor'; // everything else in one vendor chunk
                    }
                },
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'chunks/[name]-[hash].js',
                entryFileNames: '[name]-[hash].js',
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'zustand', 'axios'],
        exclude: ['@react-three/rapier'],
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        exclude: [
            ...configDefaults.exclude,
            'tests/**',
        ],
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
        server: {
            deps: {
                inline: ['@exodus/bytes', 'html-encoding-sniffer']
            }
        }
    }
});
