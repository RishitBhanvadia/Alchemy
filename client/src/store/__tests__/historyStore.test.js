import { describe, it, expect, beforeEach, vi } from 'vitest';
import useHistoryStore from '../historyStore';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  }
}));

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
    it('should handle unauthenticated user', async () => {
      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual([]);
      expect(state.loading).toBe(false);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it('should fetch logs for authenticated user', async () => {
      const mockUser = { id: 'user123' };
      const mockLogs = [{ id: 1, name: 'Exp 1' }, { id: 2, name: 'Exp 2' }];

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockLogs, error: null })
      };
      supabase.from.mockReturnValue(mockQuery);

      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual(mockLogs);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeDefined();

      expect(supabase.from).toHaveBeenCalledWith('experiment_logs');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('student_id', mockUser.id);
      expect(mockQuery.order).toHaveBeenCalledWith('ran_at', { ascending: false });
      expect(mockQuery.limit).toHaveBeenCalledWith(100);
    });

    it('should handle fetch error', async () => {
      const mockUser = { id: 'user123' };

      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Fetch failed' } })
      };
      supabase.from.mockReturnValue(mockQuery);

      await useHistoryStore.getState().fetch();

      const state = useHistoryStore.getState();
      expect(state.logs).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Fetch failed');
    });

    it('should use cache if fetched recently', async () => {
      const mockUser = { id: 'user123' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      useHistoryStore.setState({ lastFetched: Date.now() });

      await useHistoryStore.getState().fetch();

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should clear lastFetched and call fetch', async () => {
      useHistoryStore.setState({ lastFetched: 123456789 });

      supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      await useHistoryStore.getState().refresh();

      const state = useHistoryStore.getState();
      expect(state.lastFetched).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset store state', () => {
      useHistoryStore.setState({
        logs: [{ id: 1 }],
        loading: true,
        error: 'Error',
        lastFetched: 123,
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
