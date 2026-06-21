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

  it('should render all input fields', () => {
    renderSignUpForm();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderSignUpForm();
    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter your full scientific name/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/security key is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/please choose your lab role/i)).toBeInTheDocument();
  });

  it('should validate password match', async () => {
    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Jane' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password124' } });

    fireEvent.click(screen.getByRole('heading', { name: /student/i }));
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    expect(await screen.findByText(/secret keys do not match/i)).toBeInTheDocument();
  });

  it('should handle successful sign up', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: null });
    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Jane' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('heading', { name: /teacher/i }));
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'jane@test.com',
        password: 'password123',
        options: {
          data: { full_name: 'Dr. Jane', role: 'teacher' }
        }
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
    expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
  });

  it('should handle sign up error', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: { message: 'Email already in use' } });
    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Dr. Jane' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('heading', { name: /student/i }));
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Email already in use');
  });
});
