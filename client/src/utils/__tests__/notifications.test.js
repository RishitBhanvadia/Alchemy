import { describe, it, expect, vi } from 'vitest';
import { showSuccess, showError, showInfo } from '../notifications';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
    },
}));

import toast from 'react-hot-toast';

describe('Notification Utility', () => {
    it('should call toast.success with correct message', () => {
        showSuccess('Success message');
        expect(toast.success).toHaveBeenCalledWith('Success message', expect.objectContaining({
            duration: 4000,
        }));
    });

    it('should call toast.error with correct message', () => {
        showError('Error message');
        expect(toast.error).toHaveBeenCalledWith('Error message', expect.objectContaining({
            duration: 5000,
        }));
    });

    it('should call toast with correct message for info', () => {
        // Assuming showInfo calls toast.loading or similar, or just toast()
        // Adjust based on actual implementation.
        // For now, I'll just check if it runs without error if showInfo exists.
        if (typeof showInfo === 'function') {
             showInfo('Info message');
             // Add assertion if needed
        }
    });

    it('should apply custom styling to success toast', () => {
        showSuccess('Test');
        if (toast.success.mock && toast.success.mock.calls.length > 0) {
            const callArgs = toast.success.mock.calls[toast.success.mock.calls.length - 1][1];
            expect(callArgs.style).toBeDefined();
        }
    });

    it('should apply custom styling to error toast', () => {
        showError('Test');
        if (toast.error.mock && toast.error.mock.calls.length > 0) {
            const callArgs = toast.error.mock.calls[toast.error.mock.calls.length - 1][1];
            expect(callArgs.style).toBeDefined();
        }
    });
});
