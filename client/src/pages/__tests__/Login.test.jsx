import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mocks using vi.hoisted to ensure they are available before imports
const mocks = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockSignInWithPassword: vi.fn(),
    mockToastError: vi.fn(),
    mockToastSuccess: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mocks.mockNavigate,
    };
});

// Mock supabaseClient
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: mocks.mockSignInWithPassword,
        },
    },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: mocks.mockToastError,
        success: mocks.mockToastSuccess,
    },
}));

// Mock HolographicLogin component
vi.mock('../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="holo-login">{children}</div>,
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
        // Updated: The placeholders match the component implementation found in CI logs
        expect(screen.getByPlaceholderText(/student@university.edu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mocks.mockSignInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderLogin();

        // Use getByLabelText for better accessibility testing and reliability
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('should handle login error', async () => {
        mocks.mockSignInWithPassword.mockResolvedValue({
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
            expect(mocks.mockSignInWithPassword).toHaveBeenCalled();
            expect(mocks.mockToastError).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
        });
    });
});
