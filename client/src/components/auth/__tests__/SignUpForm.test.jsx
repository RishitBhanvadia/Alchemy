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

  const renderSignUp = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('should render all input fields', () => {
    renderSignUp();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    expect(screen.getAllByText(/student/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/teacher/i)[0]).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    renderSignUp();

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/please enter your full scientific name/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/security key is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose your lab role/i)).toBeInTheDocument();
  });

  it('should show error for password mismatch', async () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password456' } });

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/secret keys do not match/i)).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Marie Curie' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getAllByText('Student')[0]);

    const submitBtn = screen.getByRole('button', { name: /initialize account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'marie@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Marie Curie', role: 'student' }
        }
      });
    });

    expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
  });
});
