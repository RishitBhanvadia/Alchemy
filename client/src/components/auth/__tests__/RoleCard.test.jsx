import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoleCard from '../RoleCard';

describe('RoleCard Component', () => {
    it('should render student role', () => {
        const mockOnSelect = vi.fn();
        render(<RoleCard role="student" selected={false} onSelect={mockOnSelect} />);

        expect(screen.getByText('Student')).toBeInTheDocument();
        expect(screen.getByText('Explore experiments and join classrooms.')).toBeInTheDocument();
    });

    it('should render teacher role', () => {
        const mockOnSelect = vi.fn();
        render(<RoleCard role="teacher" selected={false} onSelect={mockOnSelect} />);

        expect(screen.getByText('Teacher')).toBeInTheDocument();
        expect(screen.getByText('Manage labs and track student progress.')).toBeInTheDocument();
    });

    it('should call onSelect with role when clicked', () => {
        const mockOnSelect = vi.fn();
        render(<RoleCard role="student" selected={false} onSelect={mockOnSelect} />);

        // Find the wrapper element and click it
        const studentTitle = screen.getByText('Student');
        const studentCard = studentTitle.closest('div.relative');
        fireEvent.click(studentCard);

        expect(mockOnSelect).toHaveBeenCalledWith('student');
    });

    it('should apply selected styling when selected', () => {
        const mockOnSelect = vi.fn();
        const { container } = render(<RoleCard role="student" selected={true} onSelect={mockOnSelect} />);

        const card = container.firstChild;
        expect(card).toHaveClass('bg-lab-purple/10');
    });
});
