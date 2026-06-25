import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';
import { supabase } from '../../../supabaseClient';
import toast from 'react-hot-toast';

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

describe('SignUpForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    return render(<SignUpForm onTabSwitch={vi.fn()} {...props} />);
  };

  it('should render all input fields', () => {
    renderForm();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
  });

  it('should show validation errors on empty submission', async () => {
    renderForm();
    const submitButton = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your full scientific name/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(screen.getByText(/secret keys do not match/i)).toBeInTheDocument();
    });
  });

  it('should call supabase signUp on valid submission', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: null });
    const mockOnTabSwitch = vi.fn();
    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'securepass123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'securepass123' } });

    // Select role
    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'marie@example.com',
        password: 'securepass123',
        options: {
          data: { full_name: 'Marie Curie', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should handle sign up errors', async () => {
    supabase.auth.signUp.mockResolvedValue({ error: { message: 'Email already in use' } });
    renderForm();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'securepass123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'securepass123' } });

    // Select role
    fireEvent.click(screen.getByText('Student'));

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email already in use');
    });
  });
});
