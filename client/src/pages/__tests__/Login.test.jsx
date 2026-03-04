import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../Login';

const { mockSignInWithPassword, mockNavigate } = vi.hoisted(() => {
    return {
        mockSignInWithPassword: vi.fn(),
        mockNavigate: vi.fn(),
    };
});

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

vi.mock('../../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="mock-3d-login">{children}</div>,
}));

vi.mock('../../utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
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

    it('should render login form', () => {
        renderLogin();
        expect(screen.getByPlaceholderText(/student@university.edu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /access lab/i })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
            data: { user: { id: 1 } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle login error', async () => {
        mockSignInWithPassword.mockResolvedValueOnce({
            data: { user: null },
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
            // Checking button text reverts
            expect(screen.getByRole('button', { name: /access lab/i })).toBeInTheDocument();
        });
    });
});
