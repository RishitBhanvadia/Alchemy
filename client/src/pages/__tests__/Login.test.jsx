import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    signInWithPassword: vi.fn(),
    toastError: vi.fn(),
    toastSuccess: vi.fn(),
    toastLoading: vi.fn(),
    toastDismiss: vi.fn(),
}));

// Mock navigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mocks.navigate,
    };
});

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: mocks.signInWithPassword,
        },
    },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: mocks.toastError,
        success: mocks.toastSuccess,
        loading: mocks.toastLoading,
        dismiss: mocks.toastDismiss,
    },
}));

describe('Login Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLogin = () => {
        return render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
    };

    it('should render login form with accessible labels', () => {
        renderLogin();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        const submitButton = screen.getByRole('button', { name: /access lab/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mocks.signInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('should show loading state during submission', async () => {
        // Mock a delayed promise to keep it in loading state
        let resolvePromise;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mocks.signInWithPassword.mockReturnValue(promise);

        renderLogin();

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Check for loading state
        expect(screen.getByText(/accessing lab/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();

        // Resolve to finish
        resolvePromise({
            data: { user: { id: '123' } },
            error: null
        });

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalled();
        });
    });

    it('should handle login error', async () => {
        mocks.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalled();
        });

        // Should revert to normal state
        await waitFor(() => {
             expect(screen.getByRole('button', { name: /access lab/i })).not.toBeDisabled();
        });
    });
});
