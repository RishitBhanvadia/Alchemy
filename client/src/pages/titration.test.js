import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Titration from './titration';
import { BrowserRouter } from 'react-router-dom';

// Fix mock to properly structure the module exports
jest.mock('../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      }),
    }
  };
});

// Mock other dependencies...
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Polygon', () => () => <div data-testid="polygon">Polygon</div>);
jest.mock('../components/titration_setup', () => ({ aheigth, color, shaky, count }) => (
  <div data-testid="titration-setup">
    Setup: {aheigth}, {color}, {shaky ? 'shaky' : 'stable'}, {count}
  </div>
));
jest.mock('../assets/hc.png', () => 'hc.png');
jest.mock('../assets/h2so4.png', () => 'h2so4.png');
jest.mock('../assets/ab.png', () => 'ab.png');
jest.mock('../assets/10ss.png', () => '10ss.png');

describe('Titration Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('runs titration simulation correctly', async () => {
    render(
      <BrowserRouter>
        <Titration />
      </BrowserRouter>
    );

    // Setup
    fireEvent.click(screen.getByText('CONFIRM SELECTION'));
    fireEvent.click(screen.getByText('ADD 10ML ACID'));
    fireEvent.click(screen.getByText('ADD INDICATOR (KMnO4)'));

    // Start Drop
    fireEvent.click(screen.getByText('DROP'));

    // Advance time to reach count = 80 (8 seconds)
    // count increases every 100ms. 80 * 100 = 8000ms.
    act(() => {
      jest.advanceTimersByTime(8000);
    });

    // Stop
    fireEvent.click(screen.getByText('STOP'));

    // Check count is around 80. Note: regex allows for small timing variations or exact match
    // Depending on execution, it might be 80 or 81.
    const setupDiv = screen.getByTestId('titration-setup');
    const text = setupDiv.textContent;
    const countMatch = text.match(/(\d+)$/);
    const count = parseInt(countMatch[1]);
    expect(count).toBeGreaterThanOrEqual(80);

    // Shake to trigger loop and color change
    // At count >= 80, count/10 >= 8.
    // Reaction A (default) points[0] is 8. Color is #bf006b.
    // So color should update to #bf006b.
    fireEvent.click(screen.getByText('SHAKE'));

    expect(screen.getByTestId('titration-setup')).toHaveTextContent(/#bf006b/);
  });
});
