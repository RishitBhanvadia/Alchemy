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

describe('SignUpForm Component', () => {
  const mockOnTabSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpForm = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should handle signup form submission successfully', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderSignUpForm();

    const fullNameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm/i);
    const roleCard = screen.getAllByText(/Student/i)[0];
    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });

    fireEvent.change(fullNameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(roleCard);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should show validation errors when fields are empty', async () => {
    renderSignUpForm();
    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your full scientific name.')).toBeInTheDocument();
      expect(screen.getByText('Email address is required.')).toBeInTheDocument();
      expect(screen.getByText('Security key is required.')).toBeInTheDocument();
      expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  it('should show error when passwords do not match', async () => {
    renderSignUpForm();

    const passwordInput = screen.getByLabelText(/^Password$/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm/i);
    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Secret keys do not match.')).toBeInTheDocument();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });
});
