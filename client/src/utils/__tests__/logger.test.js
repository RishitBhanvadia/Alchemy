import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import logger from '../logger';

// Mock import.meta.env
vi.mock('../logger', async (importOriginal) => {
    const actual = await importOriginal();
    // Force log level to debug for tests
    actual.default.setLevel('debug');
    return actual;
});

describe('Logger Utility', () => {
    let consoleSpyLog;
    let consoleSpyError;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleSpyLog = vi.spyOn(console, 'log').mockImplementation(() => {});
        consoleSpyError = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpyLog.mockRestore();
        consoleSpyError.mockRestore();
    });

    it('should have debug, info, warn, and error methods', () => {
        expect(logger.debug).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
    });

    it('should log info messages', () => {
        logger.info('Test info message');
        // logger uses console.log under the hood for info
        expect(consoleSpyLog).toHaveBeenCalled();
    });

    it('should log error messages', () => {
        logger.error('Test error message');
        expect(consoleSpyError).toHaveBeenCalled();
    });

    it('should accept additional arguments', () => {
        logger.info('Message', { userId: 123 });
        expect(consoleSpyLog).toHaveBeenCalled();
    });
});
