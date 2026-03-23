import { describe, it, expect, beforeEach, vi } from 'vitest';
import useHistoryStore from '../historyStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('historyStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({
      logs: [],
      loading: false,
      error: null,
      lastFetched: null,
    });
    vi.clearAllMocks();
  });

  it('has initial default state', () => {
    const state = useHistoryStore.getState();
    expect(state.logs).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastFetched).toBeNull();
  });

  describe('fetch', () => {
    it('does not fetch if user is not logged in', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });
      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual([]);
      expect(state.loading).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('fetches logs successfully', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

      const mockLogs = [
        { id: '1', score: 90 },
        { id: '2', score: 85 }
      ];

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockLogs, error: null })
          })
        })
      });
      supabase.from.mockReturnValue({ select: selectMock });

      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual(mockLogs);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeGreaterThan(0);
    });

    it('handles fetch errors', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') })
          })
        })
      });
      supabase.from.mockReturnValue({ select: selectMock });

      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });

    it('skips fetch if lastFetched is recent', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

      useHistoryStore.setState({ lastFetched: Date.now() - 10000 }); // 10 seconds ago

      await useHistoryStore.getState().fetch();

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('forces a fetch by resetting lastFetched', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user1' } } });

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: [{ id: '1' }], error: null })
          })
        })
      });
      supabase.from.mockReturnValue({ select: selectMock });

      useHistoryStore.setState({ lastFetched: Date.now() - 10000 }); // 10 seconds ago

      await useHistoryStore.getState().refresh();

      expect(supabase.from).toHaveBeenCalled();
      const state = useHistoryStore.getState();
      expect(state.logs).toHaveLength(1);
    });
  });

  describe('reset', () => {
    it('resets state to defaults', () => {
      useHistoryStore.setState({
        logs: [{ id: '1' }],
        loading: true,
        error: 'error',
        lastFetched: 12345,
      });

      useHistoryStore.getState().reset();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeNull();
    });
  });
});
