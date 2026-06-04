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

describe('SignUpForm', () => {
    const mockOnTabSwitch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForm = () => {
        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    };

    it('should validate form and show errors for empty fields', async () => {
        renderForm();

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
        expect(screen.getByText('Security key is required.')).toBeInTheDocument();
        expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();

        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should submit the form successfully when all fields are valid', async () => {
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        const studentRole = screen.getByText('Student', { selector: 'h3' });
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'marie@example.com',
                password: 'password123',
                options: {
                    data: { full_name: 'Marie Curie', role: 'student' }
                }
            });
        });
    });
});
