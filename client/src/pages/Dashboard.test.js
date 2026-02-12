import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this line
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

// Wrap component in Router because it uses Link
const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

test('renders dashboard header', () => {
  renderDashboard();
  const linkElement = screen.getByText(/WELCOME, SCHOLAR/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders practicals section', () => {
  renderDashboard();
  const sectionTitle = screen.getByText(/STANDARD PRACTICALS/i);
  expect(sectionTitle).toBeInTheDocument();
});

test('renders class filters', () => {
  renderDashboard();
  expect(screen.getByText('ALL CLASSES')).toBeInTheDocument();
  expect(screen.getByText('CLASS 10')).toBeInTheDocument();
  expect(screen.getByText('CLASS 11')).toBeInTheDocument();
  expect(screen.getByText('CLASS 12')).toBeInTheDocument();
});

test('filters practicals by class', () => {
  renderDashboard();

  // Initially should show all classes (e.g. Class 10 and Class 12)
  const class10Badges = screen.getAllByText(/Class 10/i);
  expect(class10Badges.length).toBeGreaterThan(0);

  // Click Class 12 filter
  const class12Btn = screen.getByText('CLASS 12');
  fireEvent.click(class12Btn);

  // Should show Class 12
  const class12Badges = screen.getAllByText(/Class 12/i);
  expect(class12Badges.length).toBeGreaterThan(0);

  // Should NOT show Class 10
  const class10BadgesAfter = screen.queryAllByText('Class 10');
  expect(class10BadgesAfter.length).toBe(0);
});
