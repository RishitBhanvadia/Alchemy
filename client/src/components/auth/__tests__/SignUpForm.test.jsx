import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock dependencies
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

    const renderForm = () => render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    it('should validate empty form fields', async () => {
        renderForm();

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter your full scientific name/i)).toBeInTheDocument();
            expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
            expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
        });

        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });

    it('should validate password match', async () => {
        renderForm();

        const passwordInput = screen.getByLabelText(/^password/i);
        const confirmInput = screen.getByLabelText(/confirm/i);

        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmInput, { target: { value: 'different123' } });

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/secret keys do not match/i)).toBeInTheDocument();
        });
    });

    it('should successfully submit valid form', async () => {
        supabase.auth.signUp.mockResolvedValueOnce({ data: { user: {} }, error: null });

        renderForm();

        // Fill form
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@science.org' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'radiation123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'radiation123' } });

        // Select role (using h3 selector since RoleCard renders title inside h3)
        const studentRole = screen.getByText('Student', { selector: 'h3' });
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'marie@science.org',
                password: 'radiation123',
                options: {
                    data: { full_name: 'Marie Curie', role: 'student' }
                }
            });
            expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });
});
