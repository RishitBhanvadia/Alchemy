import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lab from '../lab';
import { BrowserRouter } from 'react-router-dom';

// Mock the 3D components and assets
vi.mock('../../components/3d-animations/CanvasContainer', () => ({
  default: ({ children }) => <div data-testid="canvas-container">{children}</div>
}));

vi.mock('../../components/testtube', () => ({
  default: ({ color, hasLiquid }) => <div data-testid="test-tube" style={{ color: color }}>{hasLiquid ? 'Has Liquid' : 'Empty'}</div>
}));

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    context: () => ({ revert: vi.fn() }),
    fromTo: vi.fn(),
  }
}));

// Mock assets
vi.mock('../../assets/hcl.png', () => ({ default: 'hcl.png' }));
vi.mock('../../assets/nacl.png', () => ({ default: 'nacl.png' }));
vi.mock('../../assets/cuso4.png', () => ({ default: 'cuso4.png' }));
vi.mock('../../assets/feso4.png', () => ({ default: 'feso4.png' }));

describe('Lab Component', () => {
  const renderLab = () => {
    return render(
      <BrowserRouter>
        <Lab />
      </BrowserRouter>
    );
  };

  it('renders all chemical controls', () => {
    renderLab();
    expect(screen.getByText('Conc. HCl')).toBeInTheDocument();
    expect(screen.getByText('NaCl')).toBeInTheDocument();
    expect(screen.getByText('CuSO4')).toBeInTheDocument();
    expect(screen.getByText('FeSO4')).toBeInTheDocument();
  });

  it('renders the initiate button as disabled initially', () => {
    renderLab();
    const button = screen.getByText('INITIATE REACTION');
    expect(button).toBeDisabled();
  });

  it('updates chemical values when sliders are moved', () => {
    renderLab();
    const hclInput = screen.getByLabelText('Conc. HCl');
    fireEvent.change(hclInput, { target: { value: '20' } });
    expect(hclInput.value).toBe('20');
  });

  it('enables button when at least 2 chemicals are added', () => {
      renderLab();
      const hclInput = screen.getByLabelText('Conc. HCl');
      const naclInput = screen.getByLabelText('NaCl');
      const button = screen.getByText('INITIATE REACTION');

      fireEvent.change(hclInput, { target: { value: '10' } });
      fireEvent.change(naclInput, { target: { value: '10' } });

      expect(button).not.toBeDisabled();
  });
});
