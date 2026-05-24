import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields before submitting', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /access lab/i }));

    expect(await screen.findByText(/Email address is required./i)).toBeInTheDocument();
    expect(await screen.findByText(/Security key is required./i)).toBeInTheDocument();
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.signInWithPassword with correct data on valid submission', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: {}, error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /access lab/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Lab access granted. Welcome scientist!');
  });

  it('shows error toast when login fails', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: null, error: new Error('Invalid login') });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /access lab/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Lab credentials unauthorized.');
    });
  });
});
