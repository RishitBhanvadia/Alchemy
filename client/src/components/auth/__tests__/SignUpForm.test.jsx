import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
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

  it('should show error when passwords do not match', async () => {
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Dr. Marie Curie'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'password456' } });

    // Select role
    fireEvent.click(screen.getByText('Student', { selector: 'h3' }));

    fireEvent.click(screen.getByText('Initialize Account'));

    expect(await screen.findByText('Secret keys do not match.')).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('should show error when role is not selected', async () => {
    render(<SignUpForm onTabSwitch={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Dr. Marie Curie'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'password123' } });

    // Do not select a role

    fireEvent.click(screen.getByText('Initialize Account'));

    expect(await screen.findByText('Please choose your lab role.')).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('should call supabase.auth.signUp with correct data on successful submission', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({ data: {}, error: null });
    const mockOnTabSwitch = vi.fn();

    render(<SignUpForm onTabSwitch={mockOnTabSwitch} />);

    fireEvent.change(screen.getByPlaceholderText('Dr. Marie Curie'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('scientist@alchemistry.edu'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], { target: { value: 'password123' } });
    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], { target: { value: 'password123' } });

    // Select role
    fireEvent.click(screen.getByText('Student', { selector: 'h3' }));

    fireEvent.click(screen.getByText('Initialize Account'));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'Test User', role: 'student' }
        }
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful! Verify your email to begin.');
      expect(mockOnTabSwitch).toHaveBeenCalledWith('login');
    });
  });
});
