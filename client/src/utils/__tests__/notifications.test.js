import { describe, it, expect, vi, beforeEach } from 'vitest';
import { showSuccess, showError, showInfo } from '../notifications';

// Use vi.hoisted to ensure mock variable is available for vi.mock
const toastMock = vi.hoisted(() => {
    const fn = vi.fn();
    fn.success = vi.fn();
    fn.error = vi.fn();
    fn.loading = vi.fn();
    fn.dismiss = vi.fn();
    return fn;
});

vi.mock('react-hot-toast', () => ({
    default: toastMock,
    toast: toastMock
}));

describe('notifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('calls toast.success when showSuccess is called', () => {
        showSuccess('Success!');
        expect(toastMock.success).toHaveBeenCalledWith('Success!', expect.any(Object));
    });

    it('calls toast.error when showError is called', () => {
        showError('Error!');
        expect(toastMock.error).toHaveBeenCalledWith('Error!', expect.any(Object));
    });

    it('calls toast when showInfo is called', () => {
        showInfo('Info!');
        expect(toastMock).toHaveBeenCalledWith('Info!', expect.any(Object));
    });
});
