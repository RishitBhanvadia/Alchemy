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

  it('should render all form fields', () => {
    renderSignUp();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByText(/select your role/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty submission', async () => {
    renderSignUp();

    const submitBtn = screen.getByTestId('signup-submit-btn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Please enter your full name.')).toBeInTheDocument();
      expect(screen.getByText('Please enter your email address.')).toBeInTheDocument();
      expect(screen.getByText('Please enter a password.')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
      expect(screen.getByText('Please choose whether you are a Student or a Teacher.')).toBeInTheDocument();
    });
  });

  it('should handle successful signup', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    // Select role
    fireEvent.click(screen.getByTestId('role-student'));

    fireEvent.click(screen.getByTestId('signup-submit-btn'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' },
        },
      });
      expect(toast.success).toHaveBeenCalledWith('Account created! Please check your email to verify.');
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should handle signup error', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already in use' },
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('role-teacher'));

    fireEvent.click(screen.getByTestId('signup-submit-btn'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Email already in use');
      expect(mockOnTabSwitch).not.toHaveBeenCalled();
    });
  });

  it('should validate email format', async () => {
    renderSignUp();

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("That doesn't look like a valid email.")).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    renderSignUp();

    const passwordInput = screen.getByLabelText(/^password/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    renderSignUp();

    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password124' } });
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });
});
