import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../history';

// Mock supabase
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: (...args) => mockGetUser(...args),
        },
        from: (...args) => mockFrom(...args),
    },
}));

// Mock logger to avoid console spam
vi.mock('../../utils/logger', () => ({
    default: {
        error: vi.fn(),
    }
}));

const mockExperiments = [
    {
        id: 'exp-1',
        created_at: '2023-10-15T10:00:00Z',
        experiment_type: 'Titration',
        score: 95,
        details: { volume: '10ml' }
    },
    {
        id: 'exp-2',
        created_at: '2023-10-14T14:30:00Z',
        experiment_type: 'Organic',
        score: 65,
        details: { yield: '2g' }
    }
];

describe('History Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderHistory = () => {
        return render(
            <BrowserRouter>
                <History />
            </BrowserRouter>
        );
    };

    it('should show loading state initially', () => {
        mockGetUser.mockResolvedValue(new Promise(() => {})); // pending promise
        renderHistory();
        expect(screen.getByText(/loading archives/i)).toBeInTheDocument();
    });

    it('should display empty state when no experiments exist', async () => {
        mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

        const mockEq = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
                data: [],
                error: null
            })
        });

        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: mockEq
            })
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.getByText(/no experiments recorded yet/i)).toBeInTheDocument();
        });
    });

    it('should display experiments table with data', async () => {
        mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } } });

        const mockEq = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
                data: mockExperiments,
                error: null
            })
        });

        mockFrom.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: mockEq
            })
        });

        renderHistory();

        await waitFor(() => {
            expect(screen.queryByText(/loading archives/i)).not.toBeInTheDocument();
        });

        expect(screen.getByText('Titration')).toBeInTheDocument();
        expect(screen.getByText('95/100')).toBeInTheDocument();

        expect(screen.getByText('Organic')).toBeInTheDocument();
        expect(screen.getByText('65/100')).toBeInTheDocument();

        expect(screen.getByText('volume:')).toBeInTheDocument();
        expect(screen.getByText('10ml')).toBeInTheDocument();
    });
});
