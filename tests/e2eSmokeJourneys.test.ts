import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBuildings } from '@/features/buildings/api/getBuildings';
import { submitFeedback } from '@/features/feedback/api/feedbackApi';
import { getBestRoute } from '@/features/routes/api/getBestRoute';
import { moderateFeedback, updateAdminBuilding } from '@/features/admin/api/adminApi';

type QueryResult = { data: unknown; error: unknown };
type Chain = Promise<QueryResult> & {
  eq: (...args: unknown[]) => Chain;
  order: (...args: unknown[]) => Chain;
  or: (...args: unknown[]) => Chain;
  contains: (...args: unknown[]) => Chain;
  limit: (...args: unknown[]) => Chain;
  in: (...args: unknown[]) => Chain;
  maybeSingle: (...args: unknown[]) => Promise<QueryResult>;
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
  promise.maybeSingle = () => Promise.resolve(result);
  return promise;
}

const mocks = vi.hoisted(() => ({
  getSupabaseClientMock: vi.fn(),
  getProfileMock: vi.fn()
}));

vi.mock('@/services/supabase/client', () => ({
  getSupabaseClient: mocks.getSupabaseClientMock
}));

vi.mock('@/features/profile/api/profileApi', () => ({
  getProfile: mocks.getProfileMock
}));

describe('E2E smoke journeys (mocked backend)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes search -> route -> feedback journey', async () => {
    const buildingRow = {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Central Library',
      code: 'LIB',
      description: 'Main reading hall',
      latitude: 12.9716,
      longitude: 77.5946,
      tags: ['study'],
      is_active: true
    };

    const routeRow = {
      id: '22222222-2222-4222-8222-222222222222',
      distance_m: 380,
      duration_min: 6,
      is_accessible: true,
      path_geojson: null
    };

    const buildingsChain = createChain({ data: [buildingRow], error: null });
    const routeChain = createChain({ data: routeRow, error: null });
    const feedbackInsertSpy = vi.fn().mockResolvedValue({ error: null });

    mocks.getSupabaseClientMock.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'student-1' } } })
      },
      from: vi.fn((table: string) => {
        if (table === 'buildings') {
          return {
            select: vi.fn(() => buildingsChain)
          };
        }

        if (table === 'routes') {
          return {
            select: vi.fn(() => routeChain)
          };
        }

        if (table === 'feedback') {
          return {
            insert: feedbackInsertSpy
          };
        }

        return {
          select: vi.fn(() => createChain({ data: [], error: null }))
        };
      })
    });

    const searchResults = await getBuildings('library');
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0]?.id).toBe('11111111-1111-4111-8111-111111111111');

    const route = await getBestRoute(
      '33333333-3333-4333-8333-333333333333',
      searchResults[0]!.id,
      true
    );
    expect(route.distance_m).toBe(380);
    expect(route.steps.length).toBeGreaterThan(0);

    await submitFeedback({
      category: 'general',
      sentiment: 5,
      message: 'Reached library smoothly from the suggested route.',
      building_id: searchResults[0]!.id,
      route_id: route.id
    });

    expect(feedbackInsertSpy).toHaveBeenCalledTimes(1);
  });

  it('completes admin building update -> feedback moderation journey', async () => {
    mocks.getProfileMock.mockResolvedValue({
      id: 'admin-1',
      full_name: 'Admin User',
      avatar_url: null,
      role: 'admin',
      accessibility_prefs: {}
    });

    const updateSpy = vi.fn(() => createChain({ data: null, error: null }));
    const feedbackActionInsertSpy = vi.fn().mockResolvedValue({ error: null });

    mocks.getSupabaseClientMock.mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === 'buildings') {
          return {
            update: updateSpy
          };
        }

        if (table === 'feedback') {
          return {
            update: vi.fn(() => createChain({ data: null, error: null }))
          };
        }

        if (table === 'feedback_actions') {
          return {
            insert: feedbackActionInsertSpy
          };
        }

        return {
          select: vi.fn(() => createChain({ data: [], error: null }))
        };
      })
    });

    await updateAdminBuilding('b-lib', { name: 'Central Library Annex', is_active: true });
    await moderateFeedback('fb-123', 'resolved', 'Issue validated and resolved by facilities team.');

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(feedbackActionInsertSpy).toHaveBeenCalledTimes(1);
  });
});