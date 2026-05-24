import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

describe('SignUpForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields before submitting', async () => {
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    expect(await screen.findByText(/Please enter your full scientific name./i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('calls supabase.auth.signUp with correct data on valid submission', async () => {
    const mockOnTabSwitch = vi.fn();
    supabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null });

    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });

    // We use label text
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' }
        }
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
    expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
  });

  it('shows error toast when signup fails', async () => {
    const mockOnTabSwitch = vi.fn();
    supabase.auth.signUp.mockResolvedValueOnce({ data: null, error: new Error('Email already taken') });

    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });

    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already taken');
    });
  });
});
