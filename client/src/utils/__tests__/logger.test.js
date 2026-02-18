import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import log from 'loglevel';

const cleanFactory = log.methodFactory;

describe('Logger Utility', () => {
    let logger;
    let consoleLogSpy;
    let consoleInfoSpy;
    let consoleErrorSpy;

    beforeEach(async () => {
        vi.resetModules();

        // Restore loglevel to clean state to prevent multiple wrappers
        log.methodFactory = cleanFactory;

        consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        logger = (await import('../logger')).default;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have debug, info, warn, and error methods', () => {
        expect(logger.debug).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
    });

    it('should log info messages', () => {
        logger.info('Test info message');
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('[INFO]'),
            'Test info message'
        );
    });

    it('should log error messages', () => {
        logger.error('Test error message');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('[ERROR]'),
            'Test error message'
        );
    });

    it('should accept additional arguments', () => {
        logger.info('Message', { userId: 123 });
        expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining('[INFO]'),
            'Message',
            { userId: 123 }
        );
    });
});
