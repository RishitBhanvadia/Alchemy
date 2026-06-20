import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

import { supabase } from '../../../supabaseClient';

vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SignUpForm Component', () => {
  const mockOnTabSwitch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignUpForm = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should render signup form fields', () => {
    renderSignUpForm();
    expect(screen.getByPlaceholderText(/dr. marie curie/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/scientist@alchemistry.edu/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/••••••••/i)).toHaveLength(2);
    expect(screen.getAllByText(/student/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/teacher/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /initialize account/i })).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null,
    });

    renderSignUpForm();

    fireEvent.change(screen.getByPlaceholderText(/dr. marie curie/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByPlaceholderText(/scientist@alchemistry.edu/i), {
      target: { value: 'test@example.com' },
    });

    const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

    const studentElement = screen.getAllByText(/student/i)[0];
    fireEvent.click(studentElement);

    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' },
        },
      });
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });

  it('should display validation errors for empty form', async () => {
    renderSignUpForm();
    fireEvent.click(screen.getByRole('button', { name: /initialize account/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter your full scientific name.')).toBeInTheDocument();
      expect(screen.getByText('Email address is required.')).toBeInTheDocument();
      expect(screen.getByText('Security key is required.')).toBeInTheDocument();
      expect(screen.getByText('Please choose your lab role.')).toBeInTheDocument();
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });
});
