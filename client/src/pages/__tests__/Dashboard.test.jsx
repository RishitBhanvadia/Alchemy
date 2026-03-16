import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { toast } from 'react-hot-toast';

const { mockGetUser, mockFrom, mockSelect, mockEq, mockSingle, mockInsert } = vi.hoisted(() => {
    const mockSingle = vi.fn();
    const mockEq = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
             single: mockSingle
        }),
        single: mockSingle
    });
    // It's possible we need to return 'this' for eq chaining correctly
    // Since mockEq needs to have .eq() return itself or an object with .single
    const eqChain = {
        eq: vi.fn(),
        single: mockSingle
    };
    eqChain.eq.mockReturnValue(eqChain);

    const mockSelect = vi.fn().mockReturnValue({ eq: eqChain.eq });
    const mockInsert = vi.fn();

    const mockFrom = vi.fn().mockReturnValue({
        select: mockSelect,
        insert: mockInsert
    });

    const mockGetUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user123', email: 'test@example.com' } },
    });

    return { mockGetUser, mockFrom, mockSelect, mockEq: eqChain.eq, mockSingle, mockInsert };
});

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('react-hot-toast', () => ({
    toast: Object.assign(vi.fn(), {
        success: vi.fn(),
        error: vi.fn(),
    }),
}));

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: mockGetUser,
        },
        from: mockFrom,
    },
}));

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderDashboard = () => {
        return render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
    };

    it('should render dashboard title', () => {
        renderDashboard();
        expect(screen.getByText((text) => text.match(/dashboard/i))).toBeInTheDocument();
    });

    it('should render module cards', () => {
        renderDashboard();
        // Check for module names
        expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
    });

    it('should navigate on module card click', () => {
        renderDashboard();
        const labCard = screen.getByText(/laboratory/i).closest('a');
        expect(labCard).toHaveAttribute('href', '/lab');
    });

    describe('Join Classroom Flow', () => {
        it('should join a classroom successfully', async () => {
            // Mock valid class (1st call to single)
            mockSingle.mockResolvedValueOnce({
                data: { id: 'class123', class_name: 'Chemistry 101' },
                error: null
            });
            // Mock not already in class (2nd call to single)
            mockSingle.mockResolvedValueOnce({
                data: null,
                error: null
            });
            // Mock insert success
            mockInsert.mockResolvedValueOnce({ error: null });

            renderDashboard();

            const input = screen.getByPlaceholderText(/enter code/i);
            const submitBtn = screen.getByRole('button', { name: /join/i });

            fireEvent.change(input, { target: { value: 'XYZ123' } });
            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(mockFrom).toHaveBeenCalledWith('classrooms');
                expect(mockFrom).toHaveBeenCalledWith('classroom_students');
                expect(toast.success).toHaveBeenCalledWith('Joined Chemistry 101!');
            });
        });

        it('should handle invalid class code error', async () => {
            // Mock invalid class
            mockSingle.mockResolvedValueOnce({
                data: null,
                error: { message: 'Not found' }
            });

            renderDashboard();

            const input = screen.getByPlaceholderText(/enter code/i);
            const submitBtn = screen.getByRole('button', { name: /join/i });

            fireEvent.change(input, { target: { value: 'BAD123' } });
            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Invalid class code');
            });
        });

        it('should handle already in classroom', async () => {
            // Mock valid class
            mockSingle.mockResolvedValueOnce({
                data: { id: 'class123', class_name: 'Chemistry 101' },
                error: null
            });
            // Mock already in class
            mockSingle.mockResolvedValueOnce({
                data: { id: 'membership123' },
                error: null
            });

            renderDashboard();

            const input = screen.getByPlaceholderText(/enter code/i);
            const submitBtn = screen.getByRole('button', { name: /join/i });

            fireEvent.change(input, { target: { value: 'XYZ123' } });
            fireEvent.click(submitBtn);

            await waitFor(() => {
                expect(toast).toHaveBeenCalledWith('You are already in this classroom');
            });
        });
    });
});
