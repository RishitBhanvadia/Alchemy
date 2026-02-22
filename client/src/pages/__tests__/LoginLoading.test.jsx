import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase with delay
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

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe('Login Loading State', () => {
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

    it('should show loading state during submission', async () => {
        // Mock a delayed response
        mockSignInWithPassword.mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return { data: { user: { id: '123' } }, error: null };
        });

        renderLogin();

        const emailInput = screen.getByLabelText(/email address/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /access lab/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        // Check if button text changes and is disabled
        expect(screen.getByRole('button', { name: /initializing.../i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /initializing.../i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /initializing.../i })).toHaveAttribute('aria-busy', 'true');

        await waitFor(() => {
            expect(mockSignInWithPassword).toHaveBeenCalled();
        });
    });
});
