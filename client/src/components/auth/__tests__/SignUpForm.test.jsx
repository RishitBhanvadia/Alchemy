import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

// Mock supabase client
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

// Mock RoleSelector
vi.mock('../RoleSelector', () => ({
  default: ({ selectedRole, setSelectedRole }) => (
    <div data-testid="role-selector">
      <button onClick={() => setSelectedRole('student')}>Student</button>
      <button onClick={() => setSelectedRole('teacher')}>Teacher</button>
      {selectedRole && <span data-testid="selected-role">{selectedRole}</span>}
    </div>
  ),
}));

describe('SignUpForm Component', () => {
  const mockOnTabSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpForm = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should render all form fields correctly', () => {
    renderSignUpForm();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByTestId('role-selector')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderSignUpForm();

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
      expect(screen.getByText(/please choose whether you are a student or a teacher/i)).toBeInTheDocument();
    });
  });

  it('should validate email format and password matching', async () => {
    renderSignUpForm();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);

    fireEvent.change(confirmInput, { target: { value: 'different' } });
    fireEvent.blur(confirmInput);

    await waitFor(() => {
      expect(screen.getByText(/that doesn't look like a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should handle successful sign up', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'John Doe', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Account created!'));
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should handle sign up error', async () => {
    const errorMessage = 'Email already in use';
    supabase.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: errorMessage },
    });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Teacher'));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockOnTabSwitch).not.toHaveBeenCalled();
    });
  });

  it('should handle rate limit error gracefully', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'rate limit' },
    });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Rate Limit' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'rate@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Email rate limit exceeded'));
    });
  });
});
