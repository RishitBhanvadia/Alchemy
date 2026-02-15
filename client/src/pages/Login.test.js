import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { supabase } from '../supabaseClient';

// Mock Supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock HolographicLogin
jest.mock('../components/3d-animations/HolographicLogin', () => {
  return ({ children }) => <div data-testid="holographic-login">{children}</div>;
});

// Mock CSS imports
jest.mock('./login.css', () => {});

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form accessible elements', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText(/student login/i)).toBeInTheDocument();

    // These should FAIL initially because of missing htmlFor/id
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /access lab/i })).toBeInTheDocument();
  });

  test('handles successful login and loading state', async () => {
    supabase.auth.signInWithPassword.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
      data: { user: { id: '123' } },
      error: null,
    }), 100)));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // If getByLabelText fails, we can't even proceed to test logic, which is fine.
    // We'll fix accessibility first.
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const button = screen.getByRole('button', { name: /access lab/i });
    fireEvent.click(button);

    // Check loading state immediately after click
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/accessing/i);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles login error gracefully', async () => {
    const errorMsg = 'Invalid login credentials';
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: errorMsg },
    });

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });

    const button = screen.getByRole('button', { name: /access lab/i });
    fireEvent.click(button);

    // Verify alert is NOT called and error is displayed
    await waitFor(() => {
        expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });

    expect(alertMock).not.toHaveBeenCalled();
  });
});
