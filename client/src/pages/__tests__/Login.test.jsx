import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));

// Mock HolographicLogin component to avoid 3D rendering issues in tests
vi.mock('../../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="mock-holographic-login">{children}</div>,
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import { supabase } from '../../supabaseClient';

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

    it('should render login form', () => {
        renderLogin();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission and show loading state', async () => {
        // Mock a delayed response to test loading state
        let resolvePromise;
        const signInPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });
        supabase.auth.signInWithPassword.mockReturnValue(signInPromise);

        renderLogin();

        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Check loading state immediately after click
        expect(submitButton).toHaveTextContent('ACCESSING...');
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveAttribute('aria-busy', 'true');

        // Resolve the promise
        resolvePromise({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle login error and reset loading state', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
            // Should reset to normal state after error
            expect(submitButton).toHaveTextContent('ACCESS LAB');
            expect(submitButton).not.toBeDisabled();
            expect(submitButton).toHaveAttribute('aria-busy', 'false');
        });
    });
});
