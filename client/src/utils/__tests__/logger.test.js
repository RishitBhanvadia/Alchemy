/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('loglevel', () => {
    return {
        default: {
            setLevel: vi.fn(),
            methodFactory: vi.fn(),
            getLevel: vi.fn(),
            debug: vi.fn(),
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        }
    };
});

import logger from '../logger';
// Get the mocked loglevel to check calls
import loglevel from 'loglevel';

describe('Logger Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call loglevel methods', () => {
        logger.info('Test info');
        expect(loglevel.info).toHaveBeenCalled();

        logger.error('Test error');
        expect(loglevel.error).toHaveBeenCalled();
    });
});
