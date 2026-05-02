import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrivateRoute, RoleRoute } from '../roleGuard';
import useAuthStore from '../../store/authStore';

// Mock the store
vi.mock('../../store/authStore', () => ({
  default: vi.fn(),
}));

const MockComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('Route Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PrivateRoute', () => {
    it('should render loading overlay when loading is true', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return true;
        return null;
      });

      render(
        <MemoryRouter>
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>
        </MemoryRouter>
      );

      // We just check that the children are NOT rendered
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return null;
        return null;
      });

      render(
        <MemoryRouter>
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return { id: 1 };
        return null;
      });

      render(
        <MemoryRouter>
          <PrivateRoute>
            <MockComponent />
          </PrivateRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('RoleRoute', () => {
    it('should redirect if user is present but profile is missing', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return { id: 1 };
        if (selector.toString().includes('profile')) return null;
        return null;
      });

      render(
        <MemoryRouter>
          <RoleRoute requiredRole="teacher">
            <MockComponent />
          </RoleRoute>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render children when user has required role', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return { id: 1 };
        if (selector.toString().includes('profile')) return { role: 'teacher' };
        return null;
      });

      render(
        <MemoryRouter>
          <RoleRoute requiredRole="teacher">
            <MockComponent />
          </RoleRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should render children when user is admin', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return { id: 1 };
        if (selector.toString().includes('profile')) return { role: 'admin' };
        return null;
      });

      render(
        <MemoryRouter>
          <RoleRoute requiredRole="student">
            <MockComponent />
          </RoleRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect if user does not have required role', () => {
      useAuthStore.mockImplementation((selector) => {
        if (selector.toString().includes('loading')) return false;
        if (selector.toString().includes('user')) return { id: 1 };
        if (selector.toString().includes('profile')) return { role: 'student' };
        return null;
      });

      render(
        <MemoryRouter>
          <RoleRoute requiredRole="teacher">
            <MockComponent />
          </RoleRoute>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });
});
