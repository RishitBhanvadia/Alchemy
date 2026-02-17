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
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        // Force loglevel to re-bind to the spied console method
        logger.setLevel('info');
        logger.info('Test info message');
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should log error messages', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        // Force loglevel to re-bind
        logger.setLevel('error');
        logger.error('Test error message');
        expect(consoleSpy).toHaveBeenCalled();
    });

    it('should accept additional arguments', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        logger.setLevel('info');
        logger.info('Message', { userId: 123 });
        expect(consoleSpy).toHaveBeenCalled();
    });
});
