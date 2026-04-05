import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

import { supabase } from '../../../supabaseClient';

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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOnTabSwitch = vi.fn();

    const renderSignUpForm = () => {
        return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    };

    it('should render signup form fields', () => {
        renderSignUpForm();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    });

    it('should have a submit button', () => {
        renderSignUpForm();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should show validation errors on empty submit', async () => {
        renderSignUpForm();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter your full scientific name/i)).toBeInTheDocument();
            expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
            expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
        });
    });

    it('should handle form submission successfully', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' } },
            error: null,
        });

        renderSignUpForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select role
        const studentRole = screen.getByText('Student');
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
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });

    it('should handle registration error', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: { message: 'Registration failed' },
        });

        renderSignUpForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select role
        const studentRole = screen.getByText('Student');
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
            expect(mockOnTabSwitch).not.toHaveBeenCalled();
        });
    });
});