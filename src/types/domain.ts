export type UserRole = 'student' | 'staff' | 'admin' | 'super_admin';

export type Building = {
  id: string;
  name: string;
  code: string;
  description: string;
  latitude: number;
  longitude: number;
  tags: string[];
  is_active: boolean;
  distance?: number; // Optional distance for search results
};

export type BuildingDetails = Building & {
  occupancy_percent: number;
  hours_json: Record<string, string> | null;
};

export type RecentDestination = {
  id: string;
  building_id: string;
  building_name: string;
  visited_at: string;
  relative_time: string;
};

export type RouteStep = {
  instruction: string;
  distance_m: number;
};

export type RouteResult = {
  id: string;
  distance_m: number;
  duration_min: number;
  is_accessible: boolean;
  steps: RouteStep[];
};

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  accessibility_prefs: {
    highContrast?: boolean;
    largerText?: boolean;
    notificationsEnabled?: boolean;
  };
};

export type FeedbackInput = {
  category: 'general' | 'report_error' | 'suggestion';
  sentiment: number;
  message: string;
  building_id?: string;
  route_id?: string;
};
