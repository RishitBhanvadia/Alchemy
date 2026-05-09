import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

vi.mock('../../../supabaseClient', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe('SignUpForm Component', () => {
    const mockOnTabSwitch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should validate empty fields and prevent submission', async () => {
        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Please enter your full scientific name/i)).toBeInTheDocument();
        expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Security key is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please choose your lab role/i)).toBeInTheDocument();

        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should show password mismatch error', async () => {
        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

        const passwordInput = screen.getByLabelText(/password/i);
        const confirmInput = screen.getByLabelText(/confirm/i);

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmInput, { target: { value: 'password456' } });

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Secret keys do not match/i)).toBeInTheDocument();
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should submit successfully with valid data', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '1' } },
            error: null
        });

        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@lab.com' } });

        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmInput = screen.getByLabelText(/confirm/i);
        fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
        fireEvent.change(confirmInput, { target: { value: 'securepassword123' } });

        const studentRole = screen.getByRole('heading', { name: /^student$/i });
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'marie@lab.com',
                password: 'securepassword123',
                options: {
                    data: { full_name: 'Marie Curie', role: 'student' }
                }
            });
        });

        expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
        expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });

    it('should display error message if signup fails', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: { message: 'Email already in use' }
        });

        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@lab.com' } });

        const passwordInput = screen.getByLabelText(/^password$/i);
        const confirmInput = screen.getByLabelText(/confirm/i);
        fireEvent.change(passwordInput, { target: { value: 'securepassword123' } });
        fireEvent.change(confirmInput, { target: { value: 'securepassword123' } });

        const studentRole = screen.getByRole('heading', { name: /^student$/i });
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
        });

        expect(toast.error).toHaveBeenCalledWith('Email already in use');
    });
});
