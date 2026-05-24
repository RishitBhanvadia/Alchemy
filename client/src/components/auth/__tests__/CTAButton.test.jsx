import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTAButton from '../CTAButton';

describe('CTAButton Component', () => {
  it('renders children correctly', () => {
    render(<CTAButton>Click Me</CTAButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = vi.fn();
    render(<CTAButton onClick={mockOnClick}>Submit</CTAButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('disables button and does not call onClick when loading is true', () => {
    const mockOnClick = vi.fn();
    render(<CTAButton loading={true} onClick={mockOnClick}>Submit</CTAButton>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
