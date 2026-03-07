import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import logger from '../../utils/logger';

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
    },
}));

// Component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Suppress console.error in tests for the expected error
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        // eslint-disable-next-line no-console
        console.error.mockRestore();
    });

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Child Component</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    });

    it('should catch error and display fallback UI', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/We apologize for the inconvenience/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
    });

    it('should log the error using logger', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(logger.error).toHaveBeenCalledWith(
            'Error boundary caught error',
            expect.objectContaining({
                error: 'Test error',
                errorInfo: expect.any(Object),
            })
        );
    });

    it('should reload the page on button click', () => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: vi.fn() },
        });

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const reloadButton = screen.getByRole('button', { name: /Reload Page/i });
        fireEvent.click(reloadButton);

        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
});
