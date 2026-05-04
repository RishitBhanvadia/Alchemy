import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '../SignUpForm';

// Mock the Supabase client
vi.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from '../../../supabaseClient';

// Mock react-hot-toast
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

  const renderSignUp = () => {
    return render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);
  };

  it('renders correctly', () => {
    renderSignUp();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm/i)).toBeInTheDocument();
  });

  it('validates empty form submissions', () => {
    renderSignUp();
    const submitBtn = screen.getByRole('button', { name: /Initialize Account/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter your full scientific name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Security key is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please choose your lab role/i)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('submits correctly when valid data is provided', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ data: { user: {} }, error: null });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Dr. Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm/i), { target: { value: 'password123' } });

    const studentRole = screen.getByText('Student', { selector: 'h3' });
    fireEvent.click(studentRole.parentElement);

    const submitBtn = screen.getByRole('button', { name: /Initialize Account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Dr. Test', role: 'student' }
        }
      });
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });
});
