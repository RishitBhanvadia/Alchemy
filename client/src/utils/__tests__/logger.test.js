import { describe, it, expect, vi, beforeEach } from 'vitest';
import logger from '../logger';

describe('Logger Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have debug, info, warn, and error methods', () => {
        expect(logger.debug).toBeDefined();
        expect(logger.info).toBeDefined();
        expect(logger.warn).toBeDefined();
        expect(logger.error).toBeDefined();
    });

    it('should log info messages', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        logger.info('Test info message');
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
        const consoleSpy = vi.spyOn(console, 'error');
        logger.error('Test error message');
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should accept additional arguments', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        logger.info('Message', { userId: 123 });
        expect(consoleSpy).toHaveBeenCalled();
    });
});
