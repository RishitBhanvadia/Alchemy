import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Titration from '../titration';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

// Mock Navbar
vi.mock('../../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock TitrationSetup
vi.mock('../../components/titration_setup', () => ({
  default: ({ acidHeight, color, shaky, count, aheigth }) => (
    <div data-testid="titration-setup">
      Setup: {aheigth || acidHeight}, {color}, {shaky ? 'shaky' : 'stable'}, {count}
    </div>
  ),
}));

// Mock assets
vi.mock('../../assets/hc.png', () => ({ default: 'hc.png' }));
vi.mock('../../assets/h2so4.png', () => ({ default: 'h2so4.png' }));
vi.mock('../../assets/ab.png', () => ({ default: 'ab.png' }));

describe('Titration Component', () => {
  it('renders without crashing', () => {
    render(<Titration />);
    expect(screen.getByText('TITRATION SETUP')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('titration-setup')).toBeInTheDocument();
  });

  it('renders initial state correctly', () => {
    render(<Titration />);
    expect(screen.getByText('HCl')).toBeInTheDocument(); // Default acid is HCl (swipe=true)
    expect(screen.getByText('NaOH')).toBeInTheDocument();
  });
});
