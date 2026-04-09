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
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignUpForm', () => {
  const mockOnTabSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    expect(screen.getAllByText(/student/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/teacher/i)[0]).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter your full scientific name.')).toBeInTheDocument();
    expect(await screen.findByText('Email address is required.')).toBeInTheDocument();
    expect(await screen.findByText('Security key is required.')).toBeInTheDocument();
    expect(await screen.findByText('Please choose your lab role.')).toBeInTheDocument();
  });

  it('shows error for mismatched passwords', async () => {
    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@curie.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getAllByText(/student/i)[0]);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Secret keys do not match.')).toBeInTheDocument();
  });

  it('handles successful signup', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null });

    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@curie.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getAllByText(/student/i)[0]);

    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'marie@curie.com',
        password: 'password123',
        options: {
          data: { full_name: 'Marie Curie', role: 'student' },
        },
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });
});
