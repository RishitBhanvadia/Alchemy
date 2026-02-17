import { describe, it, expect, vi } from 'vitest';
import { showSuccess, showError, showInfo } from '../notifications';

// Mock react-hot-toast
const toastMock = vi.fn();
toastMock.success = vi.fn();
toastMock.error = vi.fn();
toastMock.loading = vi.fn();
toastMock.dismiss = vi.fn();

vi.mock('react-hot-toast', () => ({
    default: toastMock,
}));

import toast from 'react-hot-toast';

describe('Notification Utility', () => {
    it('should call toast.success with correct message', () => {
        const message = 'Success message';
        showSuccess(message);
        expect(toast.success).toHaveBeenCalledWith(message, expect.objectContaining({
            duration: 4000,
        }));
    });

    it('should call toast.error with correct message', () => {
        const message = 'Error message';
        showError(message);
        expect(toast.error).toHaveBeenCalledWith(message, expect.objectContaining({
            duration: 5000,
        }));
    });

    it('should call toast with correct message for info', () => {
        const message = 'Info message';
        showInfo(message);
        expect(toast).toHaveBeenCalledWith(message, expect.objectContaining({
            duration: 4000,
        }));
    });

    it('should apply custom styling to success toast', () => {
        showSuccess('Test');
        const callArgs = toast.success.mock.calls[toast.success.mock.calls.length - 1][1];
        expect(callArgs.style).toBeDefined();
    });

    it('should apply custom styling to error toast', () => {
        showError('Test');
        const callArgs = toast.error.mock.calls[toast.error.mock.calls.length - 1][1];
        expect(callArgs.style).toBeDefined();
    });
});
