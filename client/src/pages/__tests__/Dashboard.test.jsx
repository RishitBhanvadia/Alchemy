import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import PropTypes from 'prop-types';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    const PropTypesMock = await import('prop-types');
    const MockLink = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
    MockLink.propTypes = {
        to: PropTypesMock.default.string.isRequired,
        children: PropTypesMock.default.node.isRequired
    };
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: MockLink
    };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => {
    const toast = vi.fn();
    toast.success = vi.fn();
    toast.error = vi.fn();
    return { toast };
});

import { toast } from 'react-hot-toast';

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
        if (labCard) {
            expect(labCard).toHaveAttribute('href', '/lab');
        }
    });

    it('should handle successful classroom join', async () => {
        // Setup mocks
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-123' } }
        });

        const mockEqClassrooms = vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
                data: { id: 'class-123', class_name: 'Chemistry 101' },
                error: null
            })
        });

        const mockEqStudents = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                    data: null, // Not in class yet
                    error: null
                })
            })
        });

        const mockInsert = vi.fn().mockResolvedValue({
            error: null
        });

        // Chain for 'classrooms'
        mockFrom.mockImplementation((table) => {
            if (table === 'classrooms') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: mockEqClassrooms
                    })
                };
            }
            if (table === 'classroom_students') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: mockEqStudents
                    }),
                    insert: mockInsert
                };
            }
        });

        renderDashboard();

        const input = screen.getByPlaceholderText(/enter code/i);
        const button = screen.getByRole('button', { name: /join/i });

        fireEvent.change(input, { target: { value: 'ABCDEF' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Joined Chemistry 101!');
        });
    });

    it('should handle invalid classroom code', async () => {
        // Setup mocks
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-123' } }
        });

        const mockEqClassrooms = vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
                data: null,
                error: new Error('Invalid class code')
            })
        });

        // Chain for 'classrooms' - simulating not found
        mockFrom.mockImplementation((table) => {
            if (table === 'classrooms') {
                return {
                    select: vi.fn().mockReturnValue({
                        eq: mockEqClassrooms
                    })
                };
            }
        });

        renderDashboard();

        const input = screen.getByPlaceholderText(/enter code/i);
        const button = screen.getByRole('button', { name: /join/i });

        fireEvent.change(input, { target: { value: 'INVALID' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid class code');
        });
    });
});
