import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock functions with vi.hoisted
const { mockNavigate, mockSignInWithPassword } = vi.hoisted(() => {
    return {
        mockNavigate: vi.fn(),
        mockSignInWithPassword: vi.fn(),
    };
});

// Mock navigate
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
            signInWithPassword: mockSignInWithPassword,
        },
    },
}));

// Mock toast
vi.mock('react-hot-toast', () => {
    const toast = vi.fn();
    toast.error = vi.fn();
    toast.success = vi.fn();
    toast.loading = vi.fn();
    toast.dismiss = vi.fn();
    return {
        default: toast,
        Toaster: () => null,
    };
});

// Mock HolographicLogin
vi.mock('../../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="holographic-login">{children}</div>
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
        expect(screen.getByPlaceholderText(/student@university.edu/i)).toBeInTheDocument();
        // Placeholder is dots '••••••••', so use label instead for robustness
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        // The button text is "ACCESS LAB", not "Login"
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

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

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
