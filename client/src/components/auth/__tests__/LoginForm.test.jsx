import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginForm from '../LoginForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

// Mock dependencies
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
  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLoginForm();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Access Lab/i })).toBeInTheDocument();
  });

  it('validates empty fields on blur', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.click(emailInput);
    await user.tab(); // blur email
    expect(await screen.findByText(/Please enter your email address/i)).toBeInTheDocument();

    await user.click(passwordInput);
    await user.tab(); // blur password
    expect(await screen.findByText(/Please enter a password/i)).toBeInTheDocument();
  });

  it('validates invalid email format', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/Email Address/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab();

    expect(await screen.findByText(/That doesn't look like a valid email/i)).toBeInTheDocument();
  });

  it('submits successfully with valid credentials', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: { id: 1 } }, error: null });

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Access Lab/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    });
  });

  it('handles invalid login error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /Access Lab/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password.');
    });
  });

  it('handles rate limit error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'rate limit exceeded' },
    });

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Access Lab/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Too many login attempts. Please wait a few minutes.');
    });
  });

  it('disables submit button while loading', async () => {
    // Make mock not resolve immediately so we can check loading state
    supabase.auth.signInWithPassword.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');

    const submitButton = screen.getByRole('button', { name: /Access Lab/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /Logging in/i })).toBeDisabled();
  });
});
