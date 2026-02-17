import { describe, it, expect, vi, beforeEach } from 'vitest';
import logger from '../logger';

describe('Logger Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have debug, info, warn, and error methods', () => {
        expect(typeof logger.debug).toBe('function');
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.warn).toBe('function');
        expect(typeof logger.error).toBe('function');
    });

    it('should log info messages', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        logger.setLevel('info'); // Ensure level allows info
        logger.info('Test info message');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should log error messages', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        logger.setLevel('error'); // Ensure level allows error
        logger.error('Test error message');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should accept additional arguments', () => {
        const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        logger.setLevel('info');
        logger.info('Message', { userId: 123 });
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
