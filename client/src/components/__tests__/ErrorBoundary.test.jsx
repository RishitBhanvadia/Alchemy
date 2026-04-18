import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';
import logger from '../../utils/logger';

vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn()
    }
}));

const ThrowError = () => {
    throw new Error('Test error');
};

describe('ErrorBoundary Component', () => {
    let consoleErrorSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        // Prevent React from logging the error to console during tests
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child-component">Normal content</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId('child-component')).toBeInTheDocument();
        expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    });

    it('should catch error, render fallback UI, and log the error', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        // Verify fallback UI is rendered
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText(/We've encountered an unexpected error/i)).toBeInTheDocument();

        // Verify logger was called
        expect(logger.error).toHaveBeenCalledWith(
            'Error boundary caught error',
            expect.objectContaining({ error: 'Test error' })
        );
    });

    it('should provide try again button to clear error state', () => {
        const { unmount } = render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const tryAgainButton = screen.getByRole('button', { name: /try again/i });
        expect(tryAgainButton).toBeInTheDocument();

        // Clicking "try again" resets hasError to false. Since ThrowError is still a child,
        // it will immediately throw again on re-render in this test setup, but we can at least
        // test the button exists and triggers a state update (which leads to another error catch).
        fireEvent.click(tryAgainButton);

        // Logger should be called again due to the re-render throwing again
        expect(logger.error).toHaveBeenCalledTimes(2);

        unmount();
    });
});
