import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock supabase client
import { supabase } from '../../../supabaseClient';
vi.mock('../../../supabaseClient', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

// Mock react-hot-toast
import toast from 'react-hot-toast';
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

    it('should render signup form with all fields', () => {
        renderSignUp();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByText(/select your role/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', async () => {
        renderSignUp();
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
            expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
            expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
            expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
            expect(screen.getByText(/please choose whether you are a student or a teacher/i)).toBeInTheDocument();
        });
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
        renderSignUp();
        const emailInput = screen.getByLabelText(/email address/i);
        fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
            expect(screen.getByText(/that doesn't look like a valid email/i)).toBeInTheDocument();
        });
    });

    it('should validate password length and mismatch', async () => {
        renderSignUp();
        const passwordInput = screen.getByLabelText(/^password/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

        // Short password
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'short' } });
        fireEvent.blur(passwordInput);
        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });

        // Mismatched password
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'validpassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'mismatch' } });
        fireEvent.blur(confirmPasswordInput);
        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('should select role correctly', async () => {
        renderSignUp();
        const studentRole = screen.getByRole('radio', { name: /student role/i });
        const teacherRole = screen.getByRole('radio', { name: /teacher role/i });

        fireEvent.click(studentRole);
        expect(studentRole).toHaveClass('selected');
        expect(studentRole).toHaveAttribute('aria-checked', 'true');

        fireEvent.click(teacherRole);
        expect(teacherRole).toHaveClass('selected');
        expect(teacherRole).toHaveAttribute('aria-checked', 'true');
        expect(studentRole).not.toHaveClass('selected');
        expect(studentRole).toHaveAttribute('aria-checked', 'false');
    });

    it('should successfully submit valid form and switch tab', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '1' } },
            error: null,
        });

        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'fullName', value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'password123' } });
        fireEvent.click(screen.getByRole('radio', { name: /student role/i }));

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'john@example.com',
                password: 'password123',
                options: {
                    data: { full_name: 'John Doe', role: 'student' }
                }
            });
            expect(toast.success).toHaveBeenCalledWith('Account created! Please check your email to verify.');
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });

    it('should handle signup error from supabase', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: null,
            error: { message: 'Email already registered' },
        });

        renderSignUp();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { name: 'fullName', value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { name: 'email', value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { name: 'password', value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { name: 'confirmPassword', value: 'password123' } });
        fireEvent.click(screen.getByRole('radio', { name: /teacher role/i }));

        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Email already registered');
            expect(mockOnTabSwitch).not.toHaveBeenCalled();
        });
    });
});
