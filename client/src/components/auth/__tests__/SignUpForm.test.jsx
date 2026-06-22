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

    const renderSignUp = () => {
        return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    };

    it('should show validation errors on empty submit', async () => {
        renderSignUp();

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
        expect(screen.getByText('Security key is required.')).toBeInTheDocument();
        expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should submit successfully with valid data', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select student role - it's a div acting as a button
        const studentRole = screen.getByText('Student').closest('div[class*="cursor-pointer"]');
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                options: {
                    data: { full_name: 'Dr. Test', role: 'student' }
                }
            });
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });

    it('should show error on password mismatch', async () => {
        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });

        const studentRole = screen.getByText('Student').closest('div[class*="cursor-pointer"]');
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Secret keys do not match.')).toBeInTheDocument();
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
});
