import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates empty form submissions', async () => {
    const user = userEvent.setup();
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    await user.click(submitButton);

    expect(screen.getByText('Please enter your full scientific name.')).toBeInTheDocument();
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Security key is required.')).toBeInTheDocument();
    expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup();
    const onTabSwitchMock = vi.fn();

    supabase.auth.signUp.mockResolvedValueOnce({ data: { user: { id: '1' } }, error: null });

    const { container } = render(<SignUpForm onTabSwitch={onTabSwitchMock} />);

    const fullNameInput = container.querySelector('input[name="fullName"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

    await user.type(fullNameInput, 'Dr. Test');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const studentRole = screen.getByText('Student').closest('div');
    fireEvent.click(studentRole);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: {
          data: { full_name: 'Dr. Test', role: 'student' }
        }
      });
    });

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
    expect(onTabSwitchMock).toHaveBeenCalledWith('login');
  });

  it('displays error message from supabase on failure', async () => {
    const user = userEvent.setup();

    supabase.auth.signUp.mockResolvedValueOnce({ data: null, error: { message: 'Email already exists' } });

    const { container } = render(<SignUpForm onTabSwitch={vi.fn()} />);

    const fullNameInput = container.querySelector('input[name="fullName"]');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]');

    await user.type(fullNameInput, 'Dr. Test');
    await user.type(emailInput, 'existing@test.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const studentRole = screen.getByText('Student').closest('div');
    fireEvent.click(studentRole);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });
});
