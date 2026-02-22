import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Define mocks before usage
const { mockNavigate, mockSignInWithPassword } = vi.hoisted(() => {
    return {
        mockNavigate: vi.fn(),
        mockSignInWithPassword: vi.fn(),
    };
});

// Mock navigate
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase with correct relative path for this test file location
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: mockSignInWithPassword,
        },
    },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
    Toaster: () => null,
}));

// Mock HolographicLogin to avoid WebGL errors
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
        // Updated based on actual component structure or expected labels/placeholders
        // Assuming implementation uses labels or placeholders.
        // If it uses labels: screen.getByLabelText(/email address/i)
        // If it uses placeholders: screen.getByPlaceholderText(/email address/i)
        // Checking the file content previously read suggests using getByLabelText is safer for accessibility compliance if labels exist.
        // However, sticking to previous test logic but fixing the mock first.
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        // The button text is likely "ACCESS LAB" based on previous context or simply "LOGIN"
        const submitButton = screen.getByRole('button', { name: /access lab/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        // Setup the mock return value for success
        mockSignInWithPassword.mockResolvedValue({
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
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    it('should handle login error', async () => {
        // Setup the mock return value for failure
        mockSignInWithPassword.mockResolvedValue({
            data: { user: null },
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
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
