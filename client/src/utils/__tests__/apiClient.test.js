import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import { supabase } from '../../supabaseClient';

vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { use: vi.fn(), eject: vi.fn() },
        },
        post: vi.fn(),
        get: vi.fn(),
      })),
    },
  };
});

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios instance', async () => {
    const apiClient = (await import('../apiClient')).default;
    expect(axios.create).toHaveBeenCalled();
    expect(apiClient).toBeDefined();
  });

  it('should attach access token to request headers if session exists', async () => {
    // Re-import to trigger interceptor setup
    vi.resetModules();
    const apiClient = (await import('../apiClient')).default;

    const mockConfig = { headers: {} };
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { access_token: 'mock-token' } },
    });

    // Check that interceptors.request.use was called
    const requestInterceptor = apiClient.interceptors.request.use.mock.calls[0][0];
    const config = await requestInterceptor(mockConfig);

    expect(config.headers.Authorization).toBe('Bearer mock-token');
  });

  it('should not attach access token if no session exists', async () => {
    vi.resetModules();
    const apiClient = (await import('../apiClient')).default;

    const mockConfig = { headers: {} };
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    });

    const requestInterceptor = apiClient.interceptors.request.use.mock.calls[0][0];
    const config = await requestInterceptor(mockConfig);

    expect(config.headers.Authorization).toBeUndefined();
  });
});
