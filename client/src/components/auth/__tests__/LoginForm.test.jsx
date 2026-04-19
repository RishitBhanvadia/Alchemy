import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

// Mock supabase
vi.mock('../../../supabaseClient', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
        },
    },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('LoginForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLogin = () => {
        return render(<LoginForm />);
    };

    it('should validate empty fields', async () => {
        renderLogin();

        const submitButton = screen.getByRole('button', { name: /access lab/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
            expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
            expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
        });
    });

    it('should handle custom error messages on login failure', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: null,
            error: { message: 'Invalid login credentials' },
        });

        renderLogin();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'wrongpass' } });

        const submitButton = screen.getByRole('button', { name: /access lab/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Lab credentials unauthorized.');
        });
    });

    it('should handle successful login', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderLogin();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /access lab/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(toast.success).toHaveBeenCalledWith('Lab access granted. Welcome scientist!');
        });
    });
});
