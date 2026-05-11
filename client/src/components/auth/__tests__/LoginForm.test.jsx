import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
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

// Provide a simple mocked AnimatePresence and motion that renders children directly
vi.mock('framer-motion', async () => {
  const React = require('react');
  const actual = await vi.importActual('framer-motion');

  const MockButton = React.forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars, react/prop-types
    const { whileHover, whileTap, ...rest } = props;
    return <button ref={ref} {...rest} />;
  });
  MockButton.displayName = 'MotionButton';

  const MockDiv = React.forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars, react/prop-types
    const { animate, transition, initial, exit, ...rest } = props;
    return <div ref={ref} {...rest} />;
  });
  MockDiv.displayName = 'MotionDiv';

  const MockP = React.forwardRef((props, ref) => {
    // eslint-disable-next-line no-unused-vars, react/prop-types
    const { animate, transition, initial, exit, ...rest } = props;
    return <p ref={ref} {...rest} />;
  });
  MockP.displayName = 'MotionP';

  // eslint-disable-next-line react/prop-types
  const MockAnimatePresence = ({ children }) => <>{children}</>;

  return {
    ...actual,
    motion: {
      button: MockButton,
      div: MockDiv,
      p: MockP,
    },
    AnimatePresence: MockAnimatePresence,
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

    const user = userEvent.setup();
    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'invalidemail');
    await user.type(passwordInput, 'password123');

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

    const user = userEvent.setup();
    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

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

    const user = userEvent.setup();
    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpass');

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

    const user = userEvent.setup();
    const emailInput = screen.getAllByRole('textbox')[0];
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    fireEvent.submit(screen.getByRole('button', { name: /access lab/i }).closest('form'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Some other error occurred');
    });
  });
});
