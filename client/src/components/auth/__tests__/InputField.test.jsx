import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '../InputField';

// Mock simple icon component
const MockIcon = () => <span data-testid="mock-icon">Icon</span>;

describe('InputField Component', () => {
    it('should render input field correctly', () => {
        render(
            <InputField
                label="Email"
                name="email"
                icon={MockIcon}
                placeholder="Enter email"
            />
        );

        const input = screen.getByLabelText(/email/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('placeholder', 'Enter email');
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should handle value changes', () => {
        const handleChange = vi.fn();
        render(
            <InputField
                label="Email"
                name="email"
                icon={MockIcon}
                value=""
                onChange={handleChange}
            />
        );

        const input = screen.getByLabelText(/email/i);
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        expect(handleChange).toHaveBeenCalled();
    });

    it('should have proper accessibility attributes when an error is present', () => {
        render(
            <InputField
                label="Email"
                name="email"
                icon={MockIcon}
                error="Email is required"
            />
        );

        const input = screen.getByLabelText(/email/i);
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'email-error');

        const errorMessage = screen.getByText('Email is required');
        expect(errorMessage).toHaveAttribute('id', 'email-error');
    });

    it('should not have error accessibility attributes when there is no error', () => {
        render(
            <InputField
                label="Email"
                name="email"
                icon={MockIcon}
            />
        );

        const input = screen.getByLabelText(/email/i);
        expect(input).toHaveAttribute('aria-invalid', 'false');
        expect(input).not.toHaveAttribute('aria-describedby');
    });
});
