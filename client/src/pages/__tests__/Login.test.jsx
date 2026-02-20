import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock navigate
const { mockNavigate } = vi.hoisted(() => {
    return { mockNavigate: vi.fn() };
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase
const { mockSignInWithPassword } = vi.hoisted(() => {
    return { mockSignInWithPassword: vi.fn() };
});

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
}));

// Mock the holographic login component since it uses Three.js
vi.mock('../components/3d-animations/HolographicLogin', () => ({
    default: () => <div data-testid="holographic-login">Holographic Login</div>
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
        // Updated to match actual placeholders from memory/codebase
        expect(screen.getByPlaceholderText(/student@university.edu/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    });

    it('should have submit button', () => {
        renderLogin();
        // Updated to match actual button text "ACCESS LAB"
        const submitButton = screen.getByRole('button', { name: /access lab/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
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
        });
    });

    it('should handle login error', async () => {
        mockSignInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/student@university.edu/i);
        const passwordInput = screen.getByPlaceholderText(/••••••••/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
