import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mock Supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// Mock HolographicLogin
jest.mock('../components/3d-animations/HolographicLogin', () => ({ children }) => <div>{children}</div>);

// Mock image
jest.mock('../assets/logo.png', () => 'logo.png');

describe('Login Component', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ACCESS LAB/i })).toBeInTheDocument();
  });

  test('inputs are linked to labels', () => {
     render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/Email Address/i);
    expect(emailInput).toHaveAttribute('id', 'email');
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toHaveAttribute('id', 'password');
  });

  test('shows loading state on submit', async () => {
    const { supabase } = require('../supabaseClient');
    // Mock implementation to not resolve immediately so we can check loading state
    supabase.auth.signInWithPassword.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Simulate filling form
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: /ACCESS LAB/i }));

    // Check for loading text
    // Use waitFor to avoid act warnings if state updates happen
    await waitFor(() => {
        expect(screen.getByRole('button')).toHaveTextContent('LOGGING IN...');
    });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
