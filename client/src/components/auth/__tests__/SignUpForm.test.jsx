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

  const renderSignUp = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should render all input fields', () => {
    renderSignUp();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty submission', async () => {
    renderSignUp();

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter your full scientific name/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/security key is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/please choose your lab role/i)).toBeInTheDocument();
  });

  it('should call supabase sign up on valid submission', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    // Select role
    const studentRole = screen.getByText(/explore experiments/i).closest('div');
    fireEvent.click(studentRole);

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Dr. Test', role: 'student' }
        }
      });
    });

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
    expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
  });

  it('should show error toast on sign up failure', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already exists' }
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Test' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    // Select role
    const studentRole = screen.getByText(/explore experiments/i).closest('div');
    fireEvent.click(studentRole);

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Email already exists');
  });
});