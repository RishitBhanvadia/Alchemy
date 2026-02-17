import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to ensure mocks are available for the hoisted vi.mock call
const {
    mockInfo,
    mockError,
    mockLoglevel
} = vi.hoisted(() => {
    const debug = vi.fn();
    const info = vi.fn();
    const warn = vi.fn();
    const error = vi.fn();

    // Initial factory that returns the raw mocks
    const methodFactory = function (methodName) {
        return function (message, ...args) {
            if (methodName === 'debug') debug(message, ...args);
            if (methodName === 'info') info(message, ...args);
            if (methodName === 'warn') warn(message, ...args);
            if (methodName === 'error') error(message, ...args);
        };
    };

    const loglevel = {
        getLevel: vi.fn(() => 1),
        methodFactory: methodFactory,
        debug: methodFactory('debug'),
        info: methodFactory('info'),
        warn: methodFactory('warn'),
        error: methodFactory('error'),
    };

    // Simulate setLevel to update methods using the CURRENT methodFactory
    loglevel.setLevel = function() {
        this.debug = this.methodFactory('debug', 1, 'logger');
        this.info = this.methodFactory('info', 1, 'logger');
        this.warn = this.methodFactory('warn', 1, 'logger');
        this.error = this.methodFactory('error', 1, 'logger');
    };

    return {
        mockDebug: debug,
        mockInfo: info,
        mockWarn: warn,
        mockError: error,
        mockMethodFactory: methodFactory,
        mockLoglevel: loglevel
    };
});

vi.mock('loglevel', () => {
    return {
        default: mockLoglevel
    };
});

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
        logger.info('Test info message');

        expect(mockInfo).toHaveBeenCalled();
        const calls = mockInfo.mock.calls[0];
        // calls[0] is the formatted prefix string
        expect(calls[0]).toContain('[INFO]');
        // calls[1] is the original message
        expect(calls[1]).toContain('Test info message');
    });

    it('should log error messages', () => {
        logger.error('Test error message');
        expect(mockError).toHaveBeenCalled();
        const calls = mockError.mock.calls[0];
        expect(calls[0]).toContain('[ERROR]');
        expect(calls[1]).toContain('Test error message');
    });

    it('should accept additional arguments', () => {
        logger.info('Message', { userId: 123 });
        expect(mockInfo).toHaveBeenCalled();
        const calls = mockInfo.mock.calls[0];
        expect(calls[0]).toContain('[INFO]');
        expect(calls[1]).toContain('Message');
        expect(calls[2]).toEqual({ userId: 123 });
    });
});
