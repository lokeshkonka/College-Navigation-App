import type { Building, BuildingDetails, Profile, RecentDestination, RouteResult } from '@/types/domain';

export const MOCK_BUILDINGS: Building[] = [
  {
    id: '3f5f8fe1-b233-47c3-88e3-735fd2b3fab1',
    name: 'Main Library',
    code: 'LIB',
    description: 'Central library with quiet study zones.',
    latitude: 12.9718,
    longitude: 77.5948,
    tags: ['library', 'study'],
    is_active: true
  },
  {
    id: '5f4f75db-4516-4e79-a4e8-2486ce2f7159',
    name: 'Engineering Block',
    code: 'ENG',
    description: 'Engineering classrooms, labs, and seminar halls.',
    latitude: 12.9724,
    longitude: 77.5952,
    tags: ['labs', 'classrooms'],
    is_active: true
  },
  {
    id: '34fca04a-7212-48db-bf8b-324c8fd9d101',
    name: 'Student Center',
    code: 'STU',
    description: 'Food court, clubs and student support office.',
    latitude: 12.9712,
    longitude: 77.5942,
    tags: ['dining', 'services'],
    is_active: true
  }
];

export const MOCK_RECENT: RecentDestination[] = [
  {
    id: '1',
    building_id: MOCK_BUILDINGS[0]!.id,
    building_name: MOCK_BUILDINGS[0]!.name,
    visited_at: new Date(Date.now() - 36e5).toISOString(),
    relative_time: '1 hour ago'
  },
  {
    id: '2',
    building_id: MOCK_BUILDINGS[1]!.id,
    building_name: MOCK_BUILDINGS[1]!.name,
    visited_at: new Date(Date.now() - 2 * 36e5).toISOString(),
    relative_time: '2 hours ago'
  }
];

export const MOCK_PROFILE: Profile = {
  id: '6d4c641f-f43f-4879-b4dd-f8f2c42c2f2a',
  full_name: 'Campus User',
  avatar_url: null,
  role: 'student',
  accessibility_prefs: {
    highContrast: false,
    largerText: false,
    notificationsEnabled: true
  }
};

export const MOCK_ROUTES: RouteResult[] = [
  {
    id: 'f9f0aeb3-b9e2-4f7a-ae0d-8a4268efb613',
    distance_m: 620,
    duration_min: 9,
    is_accessible: true,
    steps: [
      { instruction: 'Exit Main Library from the east gate', distance_m: 90 },
      { instruction: 'Follow Central Walkway for 300m', distance_m: 300 },
      { instruction: 'Turn right at the fountain', distance_m: 80 },
      { instruction: 'Arrive at Engineering Block north entrance', distance_m: 150 }
    ]
  }
];

export function getMockBuildingDetails(id: string): BuildingDetails | undefined {
  const base = MOCK_BUILDINGS.find((building) => building.id === id);
  if (!base) {
    return undefined;
  }
  return {
    ...base,
    occupancy_percent: 58,
    hours_json: {
      mon: '08:00-20:00',
      tue: '08:00-20:00',
      wed: '08:00-20:00',
      thu: '08:00-20:00',
      fri: '08:00-18:00'
    }
  };
}
