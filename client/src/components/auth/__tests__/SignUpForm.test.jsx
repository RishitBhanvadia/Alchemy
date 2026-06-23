import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock supabase
vi.mock('../../../supabaseClient', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

import { supabase } from '../../../supabaseClient';

// Mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import toast from 'react-hot-toast';

describe('SignUpForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockOnTabSwitch = vi.fn();

    const renderSignUp = () => {
        return render(
            <SignUpForm onTabSwitch={mockOnTabSwitch} />
        );
    };

    it('should render signup form', () => {
        renderSignUp();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/^password/i)[0]).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /initialize account/i })).toBeInTheDocument();
    });

    it('should display validation errors for empty fields on submit', async () => {
        renderSignUp();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter your full scientific name/i)).toBeInTheDocument();
            expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
            expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
        });
    });

    it('should display validation errors for invalid email and short password', async () => {
        const { container } = renderSignUp();

        const fullNameInput = container.querySelector('input[name="fullName"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');

        fireEvent.change(fullNameInput, { target: { name: 'fullName', value: 'Marie Curie' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'short' } });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.queryByText(/please enter a valid email/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText(/auth key must be at least 8 characters/i)).toBeInTheDocument();
        });
    });

    it('should display validation error when passwords do not match', async () => {
        const { container } = renderSignUp();

        const fullNameInput = container.querySelector('input[name="fullName"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

        fireEvent.change(fullNameInput, { target: { name: 'fullName', value: 'Marie Curie' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'marie@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'different123' } });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText(/secret keys do not match/i)).toBeInTheDocument();
        });
    });

    it('should select role successfully', async () => {
        const { container } = renderSignUp();

        // Find the RoleCard for student. RoleCard renders an h3 with the role text.
        const studentRoleHeader = screen.getAllByText(/student/i).find(el => el.tagName.toLowerCase() === 'h3');
        const studentRoleCard = studentRoleHeader.closest('div[role="button"]') || studentRoleHeader.parentElement;
        fireEvent.click(studentRoleCard);

        const fullNameInput = container.querySelector('input[name="fullName"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

        fireEvent.change(fullNameInput, { target: { name: 'fullName', value: 'Marie Curie' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'marie@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'password123' } });

        supabase.auth.signUp.mockResolvedValue({ error: null });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.queryByText(/please choose your lab role/i)).not.toBeInTheDocument();
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'marie@example.com',
                password: 'password123',
                options: {
                    data: { full_name: 'Marie Curie', role: 'student' }
                }
            });
        });
    });

    it('should handle successful signup flow', async () => {
        const { container } = renderSignUp();

        const fullNameInput = container.querySelector('input[name="fullName"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

        fireEvent.change(fullNameInput, { target: { name: 'fullName', value: 'Marie Curie' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'marie@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'password123' } });

        const teacherRoleHeader = screen.getAllByText(/teacher/i).find(el => el.tagName.toLowerCase() === 'h3');
        const teacherRoleCard = teacherRoleHeader.closest('div[role="button"]') || teacherRoleHeader.parentElement;
        fireEvent.click(teacherRoleCard);

        supabase.auth.signUp.mockResolvedValue({ error: null });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });

    it('should handle signup error', async () => {
        const { container } = renderSignUp();

        const fullNameInput = container.querySelector('input[name="fullName"]');
        const emailInput = container.querySelector('input[name="email"]');
        const passwordInput = container.querySelector('input[name="password"]');
        const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

        fireEvent.change(fullNameInput, { target: { name: 'fullName', value: 'Marie Curie' } });
        fireEvent.change(emailInput, { target: { name: 'email', value: 'marie@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'password123' } });

        const studentRoleHeader = screen.getAllByText(/student/i).find(el => el.tagName.toLowerCase() === 'h3');
        const studentRoleCard = studentRoleHeader.closest('div[role="button"]') || studentRoleHeader.parentElement;
        fireEvent.click(studentRoleCard);

        supabase.auth.signUp.mockResolvedValue({
            error: { message: 'Email already registered' }
        });

        const form = container.querySelector('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('Email already registered');
            expect(mockOnTabSwitch).not.toHaveBeenCalled();
        });
    });
});
