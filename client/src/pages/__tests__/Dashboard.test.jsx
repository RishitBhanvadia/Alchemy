import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { supabase } from '../../supabaseClient';
import toast from 'react-hot-toast';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock supabase
vi.mock('../../supabaseClient', () => {
    const eqMock = vi.fn();
    const singleMock = vi.fn();
    const selectMock = vi.fn(() => ({ eq: eqMock }));
    eqMock.mockImplementation(() => ({ single: singleMock, eq: eqMock }));

    return {
        supabase: {
            auth: {
                getUser: vi.fn(),
            },
            from: vi.fn(() => ({
                select: selectMock,
                insert: vi.fn(),
            })),
        },
    };
});

vi.mock('react-hot-toast', () => {
    const toastMock = vi.fn();
    toastMock.success = vi.fn();
    toastMock.error = vi.fn();
    return {
        toast: toastMock,
        default: toastMock
    };
});

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        supabase.auth.getUser.mockResolvedValue({
            data: { user: { id: 'user123', email: 'test@example.com' } },
        });
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
        expect(screen.getByText('LABORATORY')).toBeInTheDocument();
        expect(screen.getByText('TITRATION')).toBeInTheDocument();
        expect(screen.getByText('ORGANIC')).toBeInTheDocument();
        expect(screen.getByText('INORGANIC')).toBeInTheDocument();
        expect(screen.getByText('CLASSROOM')).toBeInTheDocument();
    });

    it('should handle joining a classroom successfully', async () => {
        const fromMock = supabase.from;
        const mockInsert = vi.fn().mockResolvedValue({ error: null });

        // Mock chain for 'classrooms' query
        const mockSingleClassroom = vi.fn().mockResolvedValue({
            data: { id: 'class123', class_name: 'Chemistry 101' },
            error: null
        });
        const mockEqClassroom = vi.fn().mockReturnValue({ single: mockSingleClassroom });
        const mockSelectClassroom = vi.fn().mockReturnValue({ eq: mockEqClassroom });

        // Mock chain for 'class_memberships' query
        const mockSingleMembership = vi.fn().mockResolvedValue({
            data: null,
            error: null
        });
        const mockEqMembership2 = vi.fn().mockReturnValue({ single: mockSingleMembership });
        const mockEqMembership1 = vi.fn().mockReturnValue({ eq: mockEqMembership2 });
        const mockSelectMembership = vi.fn().mockReturnValue({ eq: mockEqMembership1 });

        fromMock.mockImplementation((table) => {
            if (table === 'classrooms') {
                return { select: mockSelectClassroom };
            }
            if (table === 'class_memberships') {
                return { select: mockSelectMembership, insert: mockInsert };
            }
            return {};
        });

        renderDashboard();

        const joinInput = screen.getByPlaceholderText(/enter code/i);
        const joinButton = screen.getByRole('button', { name: /join/i });

        fireEvent.change(joinInput, { target: { value: 'ABCDEF' } });
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith([
                { classroom_id: 'class123', student_id: 'user123' }
            ]);
            expect(toast.success).toHaveBeenCalledWith('Joined Chemistry 101!');
        });
    });

    it('should handle joining when user is not logged in', async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
        });

        renderDashboard();

        const joinInput = screen.getByPlaceholderText(/enter code/i);
        const joinButton = screen.getByRole('button', { name: /join/i });

        fireEvent.change(joinInput, { target: { value: 'ABCDEF' } });
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please log in first');
        });
    });

    it('should handle joining an invalid classroom code', async () => {
        const fromMock = supabase.from;

        // Mock chain for 'classrooms' query returning no class
        const mockSingleClassroom = vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' }
        });
        const mockEqClassroom = vi.fn().mockReturnValue({ single: mockSingleClassroom });
        const mockSelectClassroom = vi.fn().mockReturnValue({ eq: mockEqClassroom });

        fromMock.mockImplementation((table) => {
            if (table === 'classrooms') {
                return { select: mockSelectClassroom };
            }
            return {};
        });

        renderDashboard();

        const joinInput = screen.getByPlaceholderText(/enter code/i);
        const joinButton = screen.getByRole('button', { name: /join/i });

        fireEvent.change(joinInput, { target: { value: 'ABCDEF' } });
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid class code');
        });
    });

    it('should handle joining when already a member', async () => {
        const fromMock = supabase.from;

        // Mock chain for 'classrooms' query
        const mockSingleClassroom = vi.fn().mockResolvedValue({
            data: { id: 'class123', class_name: 'Chemistry 101' },
            error: null
        });
        const mockEqClassroom = vi.fn().mockReturnValue({ single: mockSingleClassroom });
        const mockSelectClassroom = vi.fn().mockReturnValue({ eq: mockEqClassroom });

        // Mock chain for 'class_memberships' query returning existing membership
        const mockSingleMembership = vi.fn().mockResolvedValue({
            data: { id: 'mem123', classroom_id: 'class123', student_id: 'user123' },
            error: null
        });
        const mockEqMembership2 = vi.fn().mockReturnValue({ single: mockSingleMembership });
        const mockEqMembership1 = vi.fn().mockReturnValue({ eq: mockEqMembership2 });
        const mockSelectMembership = vi.fn().mockReturnValue({ eq: mockEqMembership1 });

        fromMock.mockImplementation((table) => {
            if (table === 'classrooms') {
                return { select: mockSelectClassroom };
            }
            if (table === 'class_memberships') {
                return { select: mockSelectMembership };
            }
            return {};
        });

        renderDashboard();

        const joinInput = screen.getByPlaceholderText(/enter code/i);
        const joinButton = screen.getByRole('button', { name: /join/i });

        fireEvent.change(joinInput, { target: { value: 'ABCDEF' } });
        fireEvent.click(joinButton);

        await waitFor(() => {
            expect(toast).toHaveBeenCalledWith('You are already in this classroom');
            expect(joinInput.value).toBe(''); // Verify input is cleared
        });
    });
});
