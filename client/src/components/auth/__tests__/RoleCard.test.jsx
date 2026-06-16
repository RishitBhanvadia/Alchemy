import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleCard from '../RoleCard';

describe('RoleCard', () => {
  it('should render Student role correctly', () => {
    const onSelect = vi.fn();
    render(<RoleCard userRole="student" selected={false} onSelect={onSelect} />);

    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Explore experiments and join classrooms.')).toBeInTheDocument();
  });

  it('should render Teacher role correctly', () => {
    const onSelect = vi.fn();
    render(<RoleCard userRole="teacher" selected={false} onSelect={onSelect} />);

    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Manage labs and track student progress.')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<RoleCard userRole="student" selected={false} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Student'));
    expect(onSelect).toHaveBeenCalledWith('student');
  });

  it('should apply selected styles when selected', () => {
    const onSelect = vi.fn();
    const { container } = render(<RoleCard userRole="student" selected={true} onSelect={onSelect} />);

    // Just check that it has the selected class (shadow-lab-role-selected or bg-lab-purple/10)
    expect(container.firstChild).toHaveClass('shadow-lab-role-selected');
  });
});
