import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Use vi.hoisted to ensure mock variables are available at the top level
const { mockNavigate, mockSignInWithPassword, mockToaster } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockSignInWithPassword: vi.fn(),
    mockToaster: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: mockSignInWithPassword,
        },
    },
}));

vi.mock('react-hot-toast', () => ({
    default: mockToaster,
    Toaster: () => null, // Mock Toaster component if used
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

    it('should render login form', () => {
        renderLogin();
        // Login usually has Email and Password fields
        // Checking for labels is more accessible, but placeholder text is common fallback
        // Let's use getByLabelText if possible, or query multiple attributes
        const emailInput = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
        const passwordInput = screen.queryByLabelText(/password/i) || screen.queryByPlaceholderText(/password/i);

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        // The button might say 'Login', 'Sign In', 'Access Lab', etc.
        // Memory says "submit button with the text 'ACCESS LAB'"
        const submitButton = screen.getByRole('button', { name: /access lab/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
        const passwordInput = screen.queryByLabelText(/password/i) || screen.queryByPlaceholderText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('should handle login error', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
        const passwordInput = screen.queryByLabelText(/password/i) || screen.queryByPlaceholderText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
