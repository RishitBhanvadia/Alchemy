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
        chunkSizeWarningLimit: 500,
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-state': ['zustand', 'axios'],
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
                    'vendor-physics': ['@react-three/rapier'],
                    'vendor-charts': ['recharts', '@tanstack/react-table'],
                    'vendor-animation': ['framer-motion', 'gsap', '@use-gesture/react'],
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
                inline: [/@exodus\/bytes/, /html-encoding-sniffer/]
            }
        }
    }
});
