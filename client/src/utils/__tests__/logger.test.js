import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Logger Utility', () => {
    let logger;

    beforeEach(async () => {
        vi.resetModules();
    });

    it('should have debug, info, warn, and error methods', async () => {
        const mod = await import('../logger');
        logger = mod.default;

        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
    });

    it('should run info logger without error', async () => {
        // Spy on console BEFORE importing logger
        const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        const mod = await import('../logger');
        logger = mod.default;

        logger.info('Test info message');

        // One of them should be called
        expect(logSpy.mock.calls.length > 0 || infoSpy.mock.calls.length > 0).toBe(true);

        logSpy.mockRestore();
        infoSpy.mockRestore();
    });

    it('should run error logger without error', async () => {
        // Spy on console BEFORE importing logger
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const mod = await import('../logger');
        logger = mod.default;

        logger.error('Test error message');

        expect(errorSpy).toHaveBeenCalled();

        errorSpy.mockRestore();
    });
});
