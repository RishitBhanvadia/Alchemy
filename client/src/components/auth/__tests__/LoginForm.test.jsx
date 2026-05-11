import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
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

// Provide a simple mocked AnimatePresence and motion that renders children directly
vi.mock('framer-motion', async () => {
  const React = require('react');
  const actual = await vi.importActual('framer-motion');

  return {
    ...actual,
    motion: {
      button: React.forwardRef(({ whileHover, whileTap, ...props }, ref) => <button ref={ref} {...props} />),
      div: React.forwardRef(({ animate, transition, initial, exit, ...props }, ref) => <div ref={ref} {...props} />),
      p: React.forwardRef(({ animate, transition, initial, exit, ...props }, ref) => <p ref={ref} {...props} />),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates required fields on submission', async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole('button', { name: /access lab/i }));

    await waitFor(() => {
        expect(screen.getByText('Email address is required.')).toBeInTheDocument();
        expect(screen.getByText('Security key is required.')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<LoginForm />);

    // To hit email format error we need to bypass empty string logic for email.
    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Simulate user typing a completely wrong email format
    fireEvent.change(emailInput, { target: { name: 'email', value: 'invalid-email-format' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

    // Click submit using userEvent to ensure full synthetic cycle
    fireEvent.submit(screen.getByRole('button', { name: /access lab/i }).closest('form'));

    // Wait for the errors object to trigger update in DOM
    await waitFor(() => {
        expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: { id: '123' } }, error: null });

    render(<LoginForm />);

    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /access lab/i }).closest('form'));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Lab access granted. Welcome scientist!');
    });
  });

  it('handles specific invalid login error message', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' }
    });

    render(<LoginForm />);

    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { name: 'email', value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'wrongpass' } });

    fireEvent.submit(screen.getByRole('button', { name: /access lab/i }).closest('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Lab credentials unauthorized.');
    });
  });

  it('handles generic login errors', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Some other error occurred' }
    });

    render(<LoginForm />);

    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /access lab/i }).closest('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Some other error occurred');
    });
  });
});
