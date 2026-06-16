import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';
import React from 'react';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    }
  }
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate form fields before submitting', async () => {
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
    expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    expect(screen.getByText('Security key is required.')).toBeInTheDocument();
    expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();

    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('should successfully submit form with valid data', async () => {
    const onTabSwitch = vi.fn();
    supabase.auth.signUp.mockResolvedValue({ data: {}, error: null });

    render(<SignUpForm onTabSwitch={onTabSwitch} />);

    fireEvent.change(screen.getByPlaceholderText('Dr. Marie Curie'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@test.com' } });

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    // Find the RoleCard containing "Student" and click it
    const studentRole = screen.getByText('Student');
    fireEvent.click(studentRole);

    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
      expect(onTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should handle submission errors correctly', async () => {
    const onTabSwitch = vi.fn();
    supabase.auth.signUp.mockResolvedValue({ data: null, error: { message: 'Initialization failed.' } });

    render(<SignUpForm onTabSwitch={onTabSwitch} />);

    fireEvent.change(screen.getByPlaceholderText('Dr. Marie Curie'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@test.com' } });

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    const studentRole = screen.getByText('Student');
    fireEvent.click(studentRole);

    const submitButton = screen.getByRole('button', { name: /Initialize Account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Initialization failed.');
      expect(onTabSwitch).not.toHaveBeenCalled();
    });
  });
});
