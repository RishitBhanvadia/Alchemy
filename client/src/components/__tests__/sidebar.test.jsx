import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../sidebar';

describe('Sidebar Component', () => {
    it('should render all links with correct aria-labels', () => {
        const { getByLabelText } = render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(getByLabelText('3D Laboratory')).toBeInTheDocument();
        expect(getByLabelText('Titration')).toBeInTheDocument();
        expect(getByLabelText('Organic Chemistry')).toBeInTheDocument();
        expect(getByLabelText('Inorganic Chemistry')).toBeInTheDocument();
        expect(getByLabelText('History')).toBeInTheDocument();
    });
});
