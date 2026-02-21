import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Mock Supabase
const mockOrder = vi.fn();
const mockEq = vi.fn(() => ({
    order: mockOrder,
}));
const mockSelect = vi.fn(() => ({
    eq: mockEq,
}));

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id' } },
            }),
        },
        from: vi.fn(() => ({
            select: mockSelect,
        })),
    },
}));

describe('History Component', () => {
    it('should render empty state when no experiments are found', async () => {
        // Mock empty response
        mockOrder.mockResolvedValue({
            data: [],
            error: null,
        });

        render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        });

        // Check for new empty state content
        // These assertions will fail initially, which is expected for TDD
        expect(screen.getByRole('heading', { name: /no experiments found/i })).toBeInTheDocument();
        expect(screen.getByText(/your scientific journey begins now/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /start new experiment/i })).toBeInTheDocument();
    });
});
