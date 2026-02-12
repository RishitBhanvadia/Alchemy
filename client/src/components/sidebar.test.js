import '@testing-library/jest-dom'; // Import custom matchers
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';

describe('Sidebar Component', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { pathname: '/' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  test('renders sidebar and highlights the correct tab on click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<Sidebar />} />
        </Routes>
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    // Expect 5 links: lab, titration, organic, inorganic, history
    expect(links).toHaveLength(5);

    const labNavLink = links[0];
    const titrationNavLink = links[1];

    // Check that 'selected' class is NOT present initially (since location is '/')
    expect(labNavLink.querySelector('.element')).not.toHaveClass('selected');

    // Click the Lab link
    fireEvent.click(labNavLink);

    // Verify it is now selected.
    // Note: In the current implementation, onClick updates the state, adding the class.
    expect(labNavLink.querySelector('.element')).toHaveClass('selected');

    // Click another link
    fireEvent.click(titrationNavLink);

    // Verify Lab is not selected and Titration is
    expect(labNavLink.querySelector('.element')).not.toHaveClass('selected');
    expect(titrationNavLink.querySelector('.element')).toHaveClass('selected');
  });

  test('highlights the correct tab on initial load based on route', () => {
     // For the current implementation to work on load, window.location.pathname must match.
     window.location.pathname = '/lab';

     render(
      <MemoryRouter initialEntries={['/lab']}>
        <Sidebar />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    const labNavLink = links[0];

    // It should be selected on mount because of the useEffect reading window.location.pathname
    expect(labNavLink.querySelector('.element')).toHaveClass('selected');
  });
});
