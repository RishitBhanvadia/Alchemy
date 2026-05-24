import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from '../InputField';
import { Mail } from 'lucide-react';

describe('InputField Component', () => {
  it('renders correctly with label and placeholder', () => {
    render(
      <InputField
        label="Test Label"
        name="test"
        icon={Mail}
        placeholder="test placeholder"
        value=""
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('test placeholder')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <InputField
        label="Email"
        name="email"
        icon={Mail}
        value=""
        onChange={vi.fn()}
        error="Invalid email"
      />
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('calls onChange handler on input change', () => {
    const handleChange = vi.fn();
    render(
      <InputField
        label="Email"
        name="email"
        icon={Mail}
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
