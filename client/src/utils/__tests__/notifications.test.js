import { describe, it, expect, vi } from 'vitest';
import { showSuccess, showError, showInfo } from '../notifications';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
    const toast = vi.fn();
    toast.success = vi.fn();
    toast.error = vi.fn();
    toast.loading = vi.fn();
    toast.dismiss = vi.fn();
    return { default: toast };
});

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
        showInfo('Info message');
        expect(toast).toHaveBeenCalledWith('Info message', expect.objectContaining({
            duration: 4000,
        }));
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
