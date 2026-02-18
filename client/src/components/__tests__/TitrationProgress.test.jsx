import React from 'react';
import { render, screen } from '@testing-library/react';
import TitrationProgress from '../TitrationProgress';
import { describe, it, expect } from 'vitest';

describe('TitrationProgress', () => {
  it('renders all steps', () => {
    render(<TitrationProgress currentStep={1} />);
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Add Acid')).toBeInTheDocument();
    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Titrate')).toBeInTheDocument();
  });

  it('highlights the current step', () => {
    const { container } = render(<TitrationProgress currentStep={2} />);
    const steps = container.querySelectorAll('.step-item');
    expect(steps[1]).toHaveClass('active');
  });

  it('marks previous steps as completed', () => {
    const { container } = render(<TitrationProgress currentStep={3} />);
    const steps = container.querySelectorAll('.step-item');
    expect(steps[0]).toHaveClass('completed');
    expect(steps[1]).toHaveClass('completed');
    expect(steps[2]).toHaveClass('active');
    expect(steps[3]).not.toHaveClass('completed');
    expect(steps[3]).not.toHaveClass('active');
  });
});
