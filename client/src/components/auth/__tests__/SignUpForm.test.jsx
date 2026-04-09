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

describe('SignUpForm', () => {
    const mockOnTabSwitch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForm = () => {
        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    };

    it('should render signup form fields', () => {
        renderForm();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /initialize account/i })).toBeInTheDocument();
    });

    it('should validate empty fields and matching passwords', async () => {
        renderForm();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        // Validation error messages should be displayed
        expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
        expect(screen.getByText('Security key is required.')).toBeInTheDocument();
        expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();

        // Fill passwords that do not match
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });
        fireEvent.click(submitButton);
        expect(await screen.findByText('Secret keys do not match.')).toBeInTheDocument();
    });

    it('should submit successfully when valid', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'securepassword123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'securepassword123' } });

        // Select role by clicking the teacher role card
        const teacherCard = screen.getByText('Teacher').closest('button') || screen.getByText('Teacher');
        fireEvent.click(teacherCard);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'jane@example.com',
                password: 'securepassword123',
                options: {
                    data: { full_name: 'Dr. Jane Doe', role: 'teacher' }
                }
            });
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });
});
