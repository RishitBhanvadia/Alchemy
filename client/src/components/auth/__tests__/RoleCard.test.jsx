import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoleCard from '../RoleCard';

describe('RoleCard Component', () => {
  it('renders student role correctly', () => {
    render(<RoleCard userRole="student" selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText(/Explore experiments/)).toBeInTheDocument();
  });

  it('renders teacher role correctly', () => {
    render(<RoleCard userRole="teacher" selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText(/Manage labs/)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const mockOnSelect = vi.fn();
    render(<RoleCard userRole="student" selected={false} onSelect={mockOnSelect} />);

    // We can query by userRole or just text
    fireEvent.click(screen.getByText('Student'));
    expect(mockOnSelect).toHaveBeenCalledWith('student');
  });
});
