import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock Supabase client
import { supabase } from '../../../supabaseClient';
vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

// Mock react-hot-toast
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

  const renderSignUpForm = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should render signup form fields', () => {
    renderSignUpForm();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    renderSignUpForm();
    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter your full scientific name/i)).toBeInTheDocument();
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/security key is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/please choose your lab role/i)).toBeInTheDocument();
  });

  it('should show validation error for password mismatch', async () => {
    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });

    // Select role (using text or finding the component)
    fireEvent.click(screen.getByText('Student'));

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/secret keys do not match/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('should handle successful signup', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Teacher'));

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'marie@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Marie Curie', role: 'teacher' },
        },
      });
    });

    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
    expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
  });

  it('should handle signup error', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already registered' },
    });

    renderSignUpForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Student'));

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already registered');
    });
  });
});
