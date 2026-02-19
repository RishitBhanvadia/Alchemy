import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { supabase } from '../../supabaseClient';

// Mock Supabase client
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                order: vi.fn(),
            })),
        })),
    },
}));

// Mock Navbar since we are testing Dashboard page independently
vi.mock('../../components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Dashboard Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect to login if no user', async () => {
        supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('should render dashboard content when authenticated', async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: { email: 'test@example.com' } }
        });

        const mockSelect = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null })
        });
        supabase.from.mockReturnValue({ select: mockSelect });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/laboratory dashboard/i)).toBeInTheDocument();
            expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
        });
    });

    it('should display experiments list', async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: { email: 'test@example.com' } }
        });

        const mockExperiments = [
            {
                id: 1,
                created_at: '2023-01-01T12:00:00Z',
                chemical_a: 10,
                chemical_b: 20,
                chemical_c: 30,
                chemical_d: 40,
                result_description: 'Test Result',
                color_code: '#ff0000'
            }
        ];

        const mockOrder = vi.fn().mockResolvedValue({ data: mockExperiments, error: null });
        const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
        supabase.from.mockReturnValue({ select: mockSelect });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Result')).toBeInTheDocument();
            expect(screen.getByText('10')).toBeInTheDocument();
        });
    });
});
