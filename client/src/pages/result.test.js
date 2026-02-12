import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import Result from './result';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Result Component Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('initializes cart state lazily (only once) and handles re-renders efficiently', () => {
    // Configure useNavigate to return a no-op function to prevent unmounting/redirect side effects
    const mockNavigate = jest.fn();
    router.useNavigate.mockReturnValue(mockNavigate);

    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    const initialCart = JSON.stringify([{ id: 1 }]);
    localStorage.setItem('cart', initialCart);
    getItemSpy.mockClear();

    const Wrapper = ({ children }) => (
      <MemoryRouter initialEntries={[{ pathname: '/result', state: null }]}>
        {children}
      </MemoryRouter>
    );

    const { rerender } = render(<Result />, { wrapper: Wrapper });

    // Initial render should trigger one localStorage access
    expect(getItemSpy).toHaveBeenCalledWith('cart');
    const callsAfterMount = getItemSpy.mock.calls.length;
    expect(callsAfterMount).toBe(1);

    // Force re-render
    rerender(<Result />);

    const totalCalls = getItemSpy.mock.calls.length;

    // With optimization: lazy initialization runs only once (on mount).
    // Total calls should remain 1.
    expect(totalCalls).toBe(1);
  });
});
