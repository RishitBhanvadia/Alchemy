import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Stub environment variables BEFORE any imports that use them
vi.stubEnv('VITE_SUPABASE_URL', 'https://mock.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-key');

// Mock supabase client module
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

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock HolographicLogin
vi.mock('../components/3d-animations/HolographicLogin', () => ({
    default: ({ children }) => <div data-testid="holographic-login">{children}</div>
}));

// Import Login AFTER mocks are set up
import Login from '../Login';

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
        const submitButton = screen.getByRole('button', { name: /ACCESS LAB/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should handle form submission', async () => {
        // Prevent actual form submission which causes page reload/navigation
        // In JSDOM, form submission might be trying to navigate?
        // Actually, the error `Login failed { error: 'fetch failed' }` suggests `signInWithPassword` is trying to make a real network request.
        // This means `mockSignInWithPassword` is NOT being called, or the mock implementation is not taking effect.
        // The error trace shows: `at SupabaseAuthClient.signInWithPassword ... node_modules/@supabase/auth-js/dist/main/GoTrueClient.js:443:23`
        // This confirms the REAL Supabase client is being used, NOT the mock.

        // This is likely because `src/supabaseClient.js` exports `supabase` which is an instance created with `createClient`.
        // `vi.mock('../supabaseClient', ...)` should mock that export.

        // Let's verify if `supabaseClient` is actually mocked.
        // If `Login.jsx` imports `supabase` from `../supabaseClient`, and we mock that module, it should work.
        // However, if `supabaseClient.js` is being executed, it means the mock might be partial or failing.

        // Important: `vi.mock` paths are relative to the test file.
        // Test file: `client/src/pages/__tests__/Login.test.jsx`
        // Target: `client/src/supabaseClient.js`
        // Path `../supabaseClient` resolves to `client/src/pages/supabaseClient.js` which DOES NOT EXIST.
        // It should be `../../supabaseClient`.

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

        // Prevent default form submission just in case, though React handles it
        const form = submitButton.closest('form');
        fireEvent.submit(form);

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

        const form = submitButton.closest('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
