import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      resetPasswordForEmail: vi.fn()
    }
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate form fields before submitting', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /Access Lab/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Security key is required.')).toBeInTheDocument();

    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('should successfully submit form with valid data', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Access Lab/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Lab access granted. Welcome scientist!');
    });
  });

  it('should handle submission errors correctly', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: { message: 'Invalid login credentials' } });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpassword' } });

    const submitButton = screen.getByRole('button', { name: /Access Lab/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Lab credentials unauthorized.');
    });
  });

  // Note: the original component does not actually implement forgot password functionality,
  // it just has a dummy link.
});
