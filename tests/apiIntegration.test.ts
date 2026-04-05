import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBuildings } from '@/features/buildings/api/getBuildings';
import { submitFeedback } from '@/features/feedback/api/feedbackApi';
import { listAdminOccupancy, upsertAdminOccupancy } from '@/features/admin/api/adminApi';
import { getRecentDestinations } from '@/features/navigation/api/getRecentDestinations';

type QueryResult = { data: unknown; error: unknown };
type Chain = Promise<QueryResult> & {
  eq: (...args: unknown[]) => Chain;
  order: (...args: unknown[]) => Chain;
  or: (...args: unknown[]) => Chain;
  contains: (...args: unknown[]) => Chain;
  limit: (...args: unknown[]) => Chain;
  in: (...args: unknown[]) => Chain;
  select: (...args: unknown[]) => Chain;
  insert: (...args: unknown[]) => Promise<QueryResult>;
  update: (...args: unknown[]) => Chain;
  upsert: (...args: unknown[]) => Promise<QueryResult>;
};

function createChain(result: QueryResult): Chain {
  const promise = Promise.resolve(result) as Chain;
  promise.eq = () => promise;
  promise.order = () => promise;
  promise.or = () => promise;
  promise.contains = () => promise;
  promise.limit = () => promise;
  promise.in = () => promise;
  promise.select = () => promise;
  promise.insert = () => Promise.resolve(result);
  promise.update = () => promise;
  promise.upsert = () => Promise.resolve(result);
  return promise;
}

const mocks = vi.hoisted(() => ({
  getSupabaseClientMock: vi.fn(),
  getProfileMock: vi.fn()
}));

vi.mock('@/services/supabase/client', () => ({
  getSupabaseClient: mocks.getSupabaseClientMock
}));

vi.mock('@/features/profile/api/profileApi', () => {
  return {
    getProfile: mocks.getProfileMock
  };
});

describe('API integration-style tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps building list from Supabase rows', async () => {
    const row = {
      id: 'b1',
      name: 'Library',
      code: 'LIB',
      description: null,
      latitude: 12.1,
      longitude: 77.1,
      tags: ['library'],
      is_active: true
    };

    const chain = createChain({ data: [row], error: null });

    mocks.getSupabaseClientMock.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => chain)
      }))
    });

    const result = await getBuildings('lib');

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Library');
    expect(result[0]?.description).toBe('');
  });

  it('returns recent destinations fallback when no session user', async () => {
    mocks.getSupabaseClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } })
      }
    });

    const result = await getRecentDestinations();

    expect(result.length).toBeGreaterThan(0);
    expect(result[0]?.building_name).toBeTruthy();
  });

  it('submits feedback for authenticated user', async () => {
    const insertSpy = vi.fn().mockResolvedValue({ error: null });

    mocks.getSupabaseClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } })
      },
      from: vi.fn(() => ({
        insert: insertSpy
      }))
    });

    await submitFeedback({
      category: 'general',
      sentiment: 4,
      message: 'The route worked well and signage was clear.'
    });

    expect(insertSpy).toHaveBeenCalledTimes(1);
  });

  it('enforces admin guard for admin occupancy list', async () => {
    mocks.getProfileMock.mockResolvedValue({
      id: 'admin-user',
      full_name: 'Admin User',
      avatar_url: null,
      role: 'admin',
      accessibility_prefs: {}
    });

    const occupancyChain = createChain({
      data: [
        {
          building_id: 'b1',
          occupancy_percent: 62,
          updated_at: '2026-04-05T10:00:00.000Z'
        }
      ],
      error: null
    });

    const buildingChain = createChain({
      data: [{ id: 'b1', name: 'Main Library' }],
      error: null
    });

    mocks.getSupabaseClientMock.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'occupancy_live') {
          return {
            select: vi.fn(() => occupancyChain)
          };
        }
        if (table === 'buildings') {
          return {
            select: vi.fn(() => buildingChain)
          };
        }
        return {
          select: vi.fn(() => createChain({ data: [], error: null }))
        };
      })
    });

    const result = await listAdminOccupancy();

    expect(result).toHaveLength(1);
    expect(result[0]?.building_name).toBe('Main Library');
  });

  it('rejects invalid occupancy updates before writing', async () => {
    mocks.getProfileMock.mockResolvedValue({
      id: 'admin-user',
      full_name: 'Admin User',
      avatar_url: null,
      role: 'admin',
      accessibility_prefs: {}
    });

    mocks.getSupabaseClientMock.mockReturnValue({
      from: vi.fn()
    });

    await expect(upsertAdminOccupancy('b1', 500)).rejects.toThrow('Occupancy percent must be between 0 and 100');
  });
});
