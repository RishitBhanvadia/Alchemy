import { describe, it, expect, beforeEach, vi } from 'vitest';
import useHistoryStore from '../historyStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => {
  return {
    supabase: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

describe('historyStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useHistoryStore.setState({
      logs: [],
      loading: false,
      error: null,
      lastFetched: null,
    });
  });

  describe('fetch', () => {
    it('should set logs to empty array if not authenticated', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useHistoryStore.getState().fetch();

      expect(useHistoryStore.getState().logs).toEqual([]);
      expect(useHistoryStore.getState().loading).toBe(false);
    });

    it('should not fetch if data was fetched recently', async () => {
       const mockUser = { id: 'student123' };
       supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

       const now = Date.now();
       useHistoryStore.setState({ lastFetched: now - 10000 }); // Fetched 10s ago

       await useHistoryStore.getState().fetch();

       expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch and set logs correctly', async () => {
        const mockUser = { id: 'student123' };
        supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

        const mockLogs = [
            { id: 1, experiment: 'Exp A' },
            { id: 2, experiment: 'Exp B' }
        ];

        supabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue({ data: mockLogs, error: null })
                    })
                })
            })
        });

        await useHistoryStore.getState().fetch();

        const state = useHistoryStore.getState();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.logs).toEqual(mockLogs);
        expect(state.lastFetched).toBeDefined();
    });

    it('should handle fetch errors', async () => {
        const mockUser = { id: 'student123' };
        supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

        supabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
                    })
                })
            })
        });

        await useHistoryStore.getState().fetch();

        const state = useHistoryStore.getState();
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Database error');
        expect(state.logs).toEqual([]);
    });
  });

  describe('refresh', () => {
      it('should clear lastFetched and fetch again', async () => {
          const fetchSpy = vi.spyOn(useHistoryStore.getState(), 'fetch').mockResolvedValue();
          useHistoryStore.setState({ lastFetched: Date.now() });

          await useHistoryStore.getState().refresh();

          expect(useHistoryStore.getState().lastFetched).toBeNull();
          expect(fetchSpy).toHaveBeenCalled();
      });
  });

  describe('reset', () => {
      it('should reset store to default values', () => {
          useHistoryStore.setState({
              logs: [{ id: 1 }],
              loading: true,
              error: 'some error',
              lastFetched: Date.now()
          });

          useHistoryStore.getState().reset();

          const state = useHistoryStore.getState();
          expect(state.logs).toEqual([]);
          expect(state.error).toBeNull();
          expect(state.loading).toBe(false);
          expect(state.lastFetched).toBeNull();
      });
  });
});
