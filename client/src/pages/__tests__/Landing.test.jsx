import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Landing from '../Landing';
import { BrowserRouter } from 'react-router-dom';

// Mock the lazy loaded component
vi.mock('../../components/3d-animations/LandingScene', () => ({
  default: () => <div data-testid="landing-scene">Mocked Scene</div>
}));

// Mock assets
vi.mock('../../assets/logo.png', () => ({ default: 'logo.png' }));

describe('Landing Page', () => {
  it('renders landing content and lazy loaded scene', async () => {
    render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    // Check for static content
    expect(screen.getByText('ALCHEMISTRY')).toBeInTheDocument();
    expect(screen.getByText('Experience the Magic of Digital Chemistry')).toBeInTheDocument();
    expect(screen.getByText('ENTER LAB')).toBeInTheDocument();

    // Check for lazy loaded component (might need waitFor due to Suspense)
    await waitFor(() => {
        expect(screen.getByTestId('landing-scene')).toBeInTheDocument();
    });
  });
});
