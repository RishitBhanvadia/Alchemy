import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Use vi.hoisted to ensure mocks are available before imports
const mocks = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockSignInWithPassword: vi.fn(),
    mockToast: {
        error: vi.fn(),
        success: vi.fn()
    }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mocks.mockNavigate,
    };
});

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: mocks.mockSignInWithPassword,
        },
    },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: mocks.mockToast,
    Toaster: () => null,
}));

// Mock HolographicLogin component to simplify testing (if it contains Three.js)
vi.mock('../components/3d-animations/HolographicLogin', () => ({
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
        // Use more specific queries if possible, but placeholder text is fine
        // Note: Memory says "Login component uses accessible labels 'Email Address' and 'Password'".
        // Let's try to query by label text first, fallback to placeholder if needed.
        // But the previous test used placeholder, so let's check what the component actually renders.
        // Assuming labels or placeholders are present.
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        // Memory says submit button text is 'ACCESS LAB'
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mocks.mockSignInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'student@university.edu' } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'student@university.edu' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'student@university.edu',
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
            // Check that error was called with the message, ignoring the second argument (styles)
            expect(mocks.mockToast.error).toHaveBeenCalledWith('Invalid credentials', expect.any(Object));
        });
    });
});
