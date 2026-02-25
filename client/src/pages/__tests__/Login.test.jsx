import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Hoist mocks to ensure they are available for vi.mock
const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    signInWithPassword: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
    logger: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock navigate
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
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

// Mock notifications
vi.mock('../../utils/notifications', () => ({
    showSuccess: mocks.showSuccess,
    showError: mocks.showError,
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: mocks.logger,
}));

// Mock HolographicLogin to avoid Three.js issues in JSDOM
vi.mock('../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="holographic-login">{children}</div>,
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

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
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
            expect(mocks.showSuccess).toHaveBeenCalledWith(expect.stringMatching(/success/i));
            expect(mocks.navigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle login error', async () => {
        mocks.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalled();
            expect(mocks.showError).toHaveBeenCalledWith(expect.stringMatching(/invalid credentials/i));
        });
    });
});
