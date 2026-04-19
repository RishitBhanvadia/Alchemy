import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

// Mock supabase
vi.mock('../../../supabaseClient', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
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

describe('SignUpForm Component', () => {
    const mockOnTabSwitch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderSignUp = () => {
        return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    };

    it('should render all input fields', () => {
        renderSignUp();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
        expect(screen.getByText(/select your lab role/i)).toBeInTheDocument();
    });

    it('should handle successful registration', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderSignUp();

        // Fill form
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. John Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select role (using DOM traversal since it's a div without a button role)
        const studentTitle = screen.getByText('Student');
        const studentCard = studentTitle.closest('div.relative');
        fireEvent.click(studentCard);

        // Submit
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'john@example.com',
                password: 'password123',
                options: {
                    data: { full_name: 'Dr. John Doe', role: 'student' }
                }
            });
            expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });

    it('should validate matching passwords', async () => {
        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. John Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'different123' } });

        const studentTitle = screen.getByText('Student');
        const studentCard = studentTitle.closest('div.relative');
        fireEvent.click(studentCard);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/secret keys do not match/i)).toBeInTheDocument();
            expect(supabase.auth.signUp).not.toHaveBeenCalled();
        });
    });

    it('should handle registration error', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: { message: 'Email already in use' },
        });

        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. John Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        const studentTitle = screen.getByText('Student');
        const studentCard = studentTitle.closest('div.relative');
        fireEvent.click(studentCard);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Email already in use');
        });
    });
});
