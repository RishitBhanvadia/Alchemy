import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderSignUp = (onTabSwitch = vi.fn()) => {
        return render(
            <BrowserRouter>
                <SignUpForm onTabSwitch={onTabSwitch} />
            </BrowserRouter>
        );
    };

    it('should render signup form fields', () => {
        renderSignUp();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
        renderSignUp();
        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).not.toHaveBeenCalled();
        });
    });

    it('should handle successful signup', async () => {
        const mockOnTabSwitch = vi.fn();
        supabase.auth.signUp.mockResolvedValue({
            data: { user: { id: '123' } },
            error: null,
        });

        renderSignUp(mockOnTabSwitch);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select role
        const studentRole = screen.getByText('Student').closest('div');
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
            expect(toast.success).toHaveBeenCalled();
            expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
        });
    });
});
