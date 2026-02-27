import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import React from 'react';

// Use vi.hoisted to ensure mocks are initialized before module execution
const mocks = vi.hoisted(() => {
    return {
        navigate: vi.fn(),
        signInWithPassword: vi.fn(),
        // Mock notifications module instead of toast directly as Login.jsx imports utils/notifications
        showError: vi.fn(),
        showSuccess: vi.fn(),
    };
});

// Mock react-router-dom
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

// Mock notifications utility
vi.mock('../../utils/notifications', () => ({
    showError: mocks.showError,
    showSuccess: mocks.showSuccess,
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        info: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock the HolographicLogin component (renders children)
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
        // Check for inputs by label/placeholder as seen in Login.jsx
        expect(screen.getByPlaceholderText('student@university.edu')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ACCESS LAB/i })).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
        mocks.signInWithPassword.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText('student@university.edu');
        const passwordInput = screen.getByPlaceholderText('••••••••');
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mocks.showSuccess).toHaveBeenCalledWith('Login successful! Welcome back.');
            expect(mocks.navigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle login error', async () => {
        mocks.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid credentials' },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText('student@university.edu');
        const passwordInput = screen.getByPlaceholderText('••••••••');
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mocks.signInWithPassword).toHaveBeenCalled();
            expect(mocks.showError).toHaveBeenCalledWith('Invalid credentials');
            expect(mocks.navigate).not.toHaveBeenCalled();
        });
    });
});
