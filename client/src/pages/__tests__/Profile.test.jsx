import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../Profile';

// Mock module for Supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id', email: 'test@example.com' } },
            }),
        },
        from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: [
                        { id: 1, user_id: 'test-user-id', score: 80, experiment_type: 'Titration' },
                        { id: 2, user_id: 'test-user-id', score: 90, experiment_type: 'Organic' },
                        { id: 3, user_id: 'test-user-id', score: 100, experiment_type: 'Titration' },
                        { id: 4, user_id: 'test-user-id', score: 70, experiment_type: 'Organic' },
                        { id: 5, user_id: 'test-user-id', score: 85, experiment_type: 'Titration' },
                        { id: 6, user_id: 'test-user-id', score: 95, experiment_type: 'Organic' },
                        { id: 7, user_id: 'test-user-id', score: 100, experiment_type: 'Titration' },
                        { id: 8, user_id: 'test-user-id', score: 90, experiment_type: 'Organic' },
                        { id: 9, user_id: 'test-user-id', score: 100, experiment_type: 'Titration' },
                        { id: 10, user_id: 'test-user-id', score: 70, experiment_type: 'Organic' },
                        { id: 11, user_id: 'test-user-id', score: 85, experiment_type: 'Titration' },
                        { id: 12, user_id: 'test-user-id', score: 95, experiment_type: 'Organic' }
                    ],
                    error: null,
                }),
            }),
        }),
    },
}));

describe('Profile Component Badge Logic', () => {
    it('should correctly award titration and organic badges based on experiment history, including overlapping categories', async () => {
        // Change the mock implementation specifically for this test to include a combined type
        const { supabase } = await import('../../supabaseClient');
        supabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                    data: [
                        { id: 1, user_id: 'test-user-id', score: 80, experiment_type: 'Titration' },
                        { id: 2, user_id: 'test-user-id', score: 90, experiment_type: 'Organic' },
                        { id: 3, user_id: 'test-user-id', score: 100, experiment_type: 'Organic Titration' },
                        { id: 4, user_id: 'test-user-id', score: 70, experiment_type: 'Organic Titration' },
                    ],
                    error: null,
                }),
            }),
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('USER PROFILE')).toBeInTheDocument();
        });

        // Wait for stats logic to evaluate the badges
        await waitFor(() => {
            const titrationBadge = screen.getByText('Titration Expert').closest('.badge-item');
            const organicBadge = screen.getByText('Organic Specialist').closest('.badge-item');
            const perfectBadge = screen.getByText('Perfectionist').closest('.badge-item');

            expect(titrationBadge).toHaveClass('earned');
            expect(organicBadge).toHaveClass('earned');
            expect(perfectBadge).toHaveClass('earned');
        });
    });
});
