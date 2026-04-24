import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock supabase
import { supabase } from '../../../supabaseClient';
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
        error: vi.fn(),
        success: vi.fn(),
    },
}));

describe('SignUpForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForm = () => {
        return render(<SignUpForm onTabSwitch={vi.fn()} />);
    };

    it('should render all input fields', () => {
        renderForm();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    });

    it('should show error when required fields are empty', async () => {
        renderForm();

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter your full scientific name/i)).toBeInTheDocument();
            expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
            expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
        });
    });

    it('should show error when passwords do not match', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });

        // Select a role
        const studentRole = screen.getByText('Student').closest('div');
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/secret keys do not match/i)).toBeInTheDocument();
        });
    });

    it('should show error when password is too short', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'short' } });

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/auth key must be at least 8 characters/i)).toBeInTheDocument();
        });
    });

    it('should call signUp with correct data when form is valid', async () => {
        supabase.auth.signUp.mockResolvedValue({ data: {}, error: null });
        const mockOnTabSwitch = vi.fn();

        render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

        // Select a role
        const studentRole = screen.getByText('Student').closest('div');
        fireEvent.click(studentRole);

        const submitButton = screen.getByRole('button', { name: /initialize account/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(supabase.auth.signUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                options: {
                    data: {
                        full_name: 'Test User',
                        role: 'student'
                    }
                }
            });
        });
    });
});
