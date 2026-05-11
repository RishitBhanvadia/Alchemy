import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
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

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates all required fields before submission', async () => {
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    // Submit the form empty
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    // Check for validation errors
    expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
    expect(await screen.findByText('Email address is required.')).toBeInTheDocument();
    expect(await screen.findByText('Security key is required.')).toBeInTheDocument();
    expect(await screen.findByText('Please choose your lab role.')).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    const onTabSwitch = vi.fn();
    supabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null });

    render(<SignUpForm onTabSwitch={onTabSwitch} />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/dr\. marie curie/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/scientist@alchemistry\.edu/i), { target: { value: 'test@example.com' } });

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Student'));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Registration successful'));
      expect(onTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('handles auth errors appropriately', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ data: null, error: { message: 'Email already in use.' } });

    render(<SignUpForm onTabSwitch={vi.fn()} />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/dr\. marie curie/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/scientist@alchemistry\.edu/i), { target: { value: 'test@example.com' } });

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    fireEvent.click(screen.getByText('Teacher'));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already in use.');
    });
  });
});
