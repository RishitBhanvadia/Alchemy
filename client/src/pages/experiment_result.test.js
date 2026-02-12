import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for matchers
import ExpResult from './experiment_result';

describe('ExpResult Component', () => {
    test('renders loading gif when "on" prop is true', () => {
        render(<ExpResult num={0} on={true} />);
        const loadingImg = screen.getByRole('img');
        expect(loadingImg).toBeInTheDocument();
        expect(loadingImg).toHaveAttribute('alt', '');
    });

    test('renders result details when "on" prop is false', () => {
        const testNum = 0;
        render(<ExpResult num={testNum} on={false} />);

        expect(screen.getByText('Burnt Smell')).toBeInTheDocument();
        expect(screen.getByText('No smoke or precipitates formed')).toBeInTheDocument();
        expect(screen.getByText('The solution turned thick')).toBeInTheDocument();
        expect(screen.getByText("No precipitate formed on reaction with Nessler's Reagent")).toBeInTheDocument();
    });
});
