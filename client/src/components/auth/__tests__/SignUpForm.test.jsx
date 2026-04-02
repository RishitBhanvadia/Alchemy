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

    const renderSignUpForm = () => {
        return render(<SignUpForm onTabSwitch={vi.fn()} />);
    };

    it('should validate form and prevent submission on empty fields', async () => {
        renderSignUpForm();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should call signUp with correct data when form is filled', async () => {
        supabase.auth.signUp.mockResolvedValue({ data: {}, error: null });
        renderSignUpForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securepassword123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'securepassword123' } });
        fireEvent.click(screen.getByText('Student'));

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'jane@example.com',
                password: 'securepassword123',
                options: {
                    data: { full_name: 'Dr. Jane Doe', role: 'student' },
                },
            });
        });
    });
});
