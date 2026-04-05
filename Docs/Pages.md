# Pages Implementation Guide (Frontend + Backend + Core Logic)

This document translates every Stitch-inspired screen into Expo React Native implementation units with Supabase-backed logic.

## 0. Shared Foundations

### 0.1 Supabase Client (Frontend)
```ts
// src/services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
```

### 0.2 Query Wrapper Example
```ts
// src/features/buildings/api/getBuildings.ts
import { supabase } from '@/services/supabase/client';

export async function getBuildings(search?: string) {
  let query = supabase
    .from('buildings')
    .select('id, name, code, latitude, longitude, tags, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (search && search.trim().length > 0) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
```

### 0.3 RLS Baseline (Backend)
```sql
-- Example policy pattern
alter table public.favorites enable row level security;

create policy "favorites_owner_read"
on public.favorites
for select
using (auth.uid() = user_id);

create policy "favorites_owner_write"
on public.favorites
for insert
with check (auth.uid() = user_id);
```

## 1. Splash Screen

### Frontend Scope
- Display animated brand and progress indicator.
- Preload session and essential cached tables.
- Route to auth flow or home tabs.

### Frontend Code (Expo Router)
```tsx
// app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { supabase } from '@/services/supabase/client';

export default function SplashScreen() {
  useEffect(() => {
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace('/(tabs)/home');
      else router.replace('/(auth)/sign-in');
    };
    bootstrap();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-3xl font-extrabold text-primary">Tactile Cartographer</Text>
      <ActivityIndicator className="mt-6" />
    </View>
  );
}
```

### Backend Scope
- None required for rendering.
- Optional app-config table fetch for remote settings.

### Core Logic
- Gate on valid session.
- On session refresh failure, go to sign-in.

### TODO
- [ ] Add animation sequence matching Stitch softness.
- [ ] Add timeout fallback for slow network startup.
- [ ] Add analytics event for app cold start.

## 2. Home Screen

### Frontend Scope
- Current location card.
- Search launcher.
- Recent destinations list.
- Quick actions: Navigate, Timetable, Nearby.

### Frontend Code
```tsx
// app/(tabs)/home/index.tsx
import { useQuery } from '@tanstack/react-query';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getRecentDestinations } from '@/features/navigation/api/getRecentDestinations';

export default function HomeScreen() {
  const { data: recent = [] } = useQuery({
    queryKey: ['recent-destinations'],
    queryFn: getRecentDestinations,
  });

  return (
    <View className="flex-1 bg-background px-5 pt-6">
      <Pressable className="rounded-full bg-surface-variant px-5 py-4" onPress={() => router.push('/search')}>
        <Text className="text-on-surface-variant">Where to, explorer?</Text>
      </Pressable>

      <View className="mt-6 rounded-3xl bg-white p-5">
        <Text className="text-xs uppercase tracking-widest text-on-surface-variant">Current Status</Text>
        <Text className="mt-1 text-3xl font-extrabold text-primary">Main Library</Text>
      </View>

      <View className="mt-8">
        <Text className="text-xs uppercase tracking-widest text-outline">Recent Destinations</Text>
        {recent.map((item) => (
          <View key={item.id} className="mt-4 rounded-2xl bg-white p-4">
            <Text className="font-bold text-primary">{item.building_name}</Text>
            <Text className="text-xs text-on-surface-variant">{item.relative_time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
```

### Backend Code
```sql
create or replace view public.v_recent_destinations as
select
  rd.id,
  rd.user_id,
  rd.building_id,
  b.name as building_name,
  rd.visited_at
from recent_destinations rd
join buildings b on b.id = rd.building_id;
```

### Core Logic
- Pull user-specific recent destinations.
- Keep quick actions visible even with empty history.

### TODO
- [ ] Add live current class card from timetable table.
- [ ] Add favorite pin actions on recent items.
- [ ] Add shimmer loading states.

## 3. Search Screen

### Frontend Scope
- Debounced search input.
- Category chips (library, dining, labs, gym).
- Results list with distance and accessibility markers.

### Frontend Code
```tsx
// app/search/index.tsx
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { View, TextInput, FlatList, Text } from 'react-native';
import { getBuildings } from '@/features/buildings/api/getBuildings';

export default function SearchScreen() {
  const [term, setTerm] = useState('');
  const debounced = useMemo(() => term.trim(), [term]);

  const { data = [] } = useQuery({
    queryKey: ['buildings', debounced],
    queryFn: () => getBuildings(debounced),
  });

  return (
    <View className="flex-1 bg-background px-5 pt-4">
      <TextInput
        value={term}
        onChangeText={setTerm}
        placeholder="Search by building or code"
        className="rounded-full bg-surface-variant px-5 py-4"
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mt-4 rounded-3xl bg-white p-4">
            <Text className="text-lg font-bold text-primary">{item.name}</Text>
            <Text className="text-xs text-on-surface-variant">{item.code}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

### Backend Code
```sql
create index if not exists idx_buildings_name_trgm
on buildings using gin (name gin_trgm_ops);
```

### Core Logic
- Search term drives query key and cache.
- Category chip taps append tag filters.

### TODO
- [ ] Add minimum 2-char threshold before querying.
- [ ] Add accessibility-only filter toggle.
- [ ] Add recent searches persisted per user.

## 4. Map Screen

### Frontend Scope
- Full map canvas.
- Current location pulse.
- Floating search bar.
- Bottom route quick panel and quick-stop cards.

### Frontend Code
```tsx
// app/(tabs)/map/index.tsx
import MapView, { Marker } from 'react-native-maps';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function MapScreen() {
  return (
    <View className="flex-1 bg-background">
      <MapView className="flex-1" initialRegion={{ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
        <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }} title="You are here" />
      </MapView>

      <Pressable className="absolute top-20 left-4 right-4 rounded-full bg-surface-variant px-5 py-4" onPress={() => router.push('/search')}>
        <Text className="text-on-surface-variant">Where to, explorer?</Text>
      </Pressable>

      <View className="absolute bottom-8 left-4 right-4 rounded-[28px] bg-white p-5">
        <Text className="text-xs uppercase tracking-widest text-on-surface-variant">Fastest Route</Text>
        <Text className="mt-1 text-2xl font-bold text-primary">Engineering Quad</Text>
      </View>
    </View>
  );
}
```

### Backend Code
```sql
create table if not exists map_points (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  latitude numeric not null,
  longitude numeric not null,
  point_type text not null,
  is_active boolean not null default true
);
```

### Core Logic
- Use device location as origin.
- Fetch nearby map points by viewport bounds.
- Tap marker opens building details.

### TODO
- [ ] Add map clustering for dense POIs.
- [ ] Add indoor-floor map fallback when zoomed into building.
- [ ] Add route polyline rendering.

## 5. Building Details Screen

### Frontend Scope
- Hero, open status, occupancy meter.
- Floor selector.
- Facilities and gallery.

### Frontend Code
```tsx
// app/building/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { View, Text, Pressable } from 'react-native';
import { getBuildingById } from '@/features/buildings/api/getBuildingById';

export default function BuildingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuildingById(id),
    enabled: Boolean(id),
  });

  if (!data) return <View className="flex-1 bg-background" />;

  return (
    <View className="flex-1 bg-background px-5 pt-4">
      <Text className="text-3xl font-extrabold text-primary">{data.name}</Text>
      <Text className="mt-1 text-on-surface-variant">{data.description}</Text>

      <View className="mt-5 rounded-3xl bg-white p-4">
        <Text className="text-sm text-on-surface-variant">Occupancy</Text>
        <Text className="mt-1 text-lg font-bold text-primary">{data.occupancy_percent}%</Text>
      </View>

      <Pressable className="mt-6 rounded-full bg-primary px-5 py-4">
        <Text className="text-center font-bold text-on-primary">Start Route</Text>
      </Pressable>
    </View>
  );
}
```

### Backend Code
```sql
create or replace view public.v_building_details as
select
  b.id,
  b.name,
  b.description,
  b.hours_json,
  coalesce(ol.occupancy_percent, 0) as occupancy_percent
from buildings b
left join occupancy_live ol on ol.building_id = b.id;
```

### Core Logic
- Fetch building core info + live occupancy in one query.
- Floor selection updates room list and floor map image.

### TODO
- [ ] Add floor-level room search.
- [ ] Add facility availability badges.
- [ ] Add open-now logic from campus timezone.

## 6. Route Screen

### Frontend Scope
- Origin/destination selectors.
- Stats: duration, distance.
- Step-by-step instructions.
- Start navigation CTA.

### Frontend Code
```tsx
// app/route/index.tsx
import { useQuery } from '@tanstack/react-query';
import { View, Text, FlatList } from 'react-native';
import { getBestRoute } from '@/features/routes/api/getBestRoute';

export default function RouteScreen() {
  const originId = 'origin-id';
  const destinationId = 'destination-id';

  const { data } = useQuery({
    queryKey: ['route', originId, destinationId],
    queryFn: () => getBestRoute(originId, destinationId),
  });

  return (
    <View className="flex-1 bg-background px-5 pt-4">
      <Text className="text-2xl font-bold text-primary">Route</Text>
      <Text className="mt-1 text-on-surface-variant">
        {data?.duration_min ?? '--'} min • {data?.distance_m ?? '--'} m
      </Text>

      <FlatList
        className="mt-6"
        data={data?.steps ?? []}
        keyExtractor={(item, idx) => `${item.instruction}-${idx}`}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl bg-white p-4">
            <Text className="font-medium text-primary">{item.instruction}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

### Backend Code
```sql
create table if not exists route_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  origin_building_id uuid references buildings(id),
  destination_building_id uuid references buildings(id),
  is_accessible boolean not null default false,
  created_at timestamptz not null default now()
);
```

### Core Logic
- Resolve origin from current location or explicit source.
- Ask route function/provider for optimal path.
- Persist request for analytics.

### TODO
- [ ] Add accessible route preference toggle.
- [ ] Add re-route handling when user deviates.
- [ ] Add turn-by-turn voice cues.

## 7. Profile and Settings Screen

### Frontend Scope
- Avatar editing.
- Preference toggles.
- Accessibility and notification controls.

### Frontend Code
```tsx
// app/(tabs)/profile/index.tsx
import { useMutation, useQuery } from '@tanstack/react-query';
import { Switch, View, Text } from 'react-native';
import { getProfile, updateProfilePrefs } from '@/features/profile/api/profileApi';

export default function ProfileScreen() {
  const { data } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const mutation = useMutation({
    mutationFn: updateProfilePrefs,
  });

  return (
    <View className="flex-1 bg-background px-5 pt-4">
      <Text className="text-2xl font-bold text-primary">Profile Settings</Text>

      <View className="mt-6 rounded-3xl bg-white p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-on-surface">High Contrast</Text>
          <Switch
            value={Boolean(data?.accessibility_prefs?.highContrast)}
            onValueChange={(next) => mutation.mutate({ highContrast: next })}
          />
        </View>
      </View>
    </View>
  );
}
```

### Backend Code
```sql
alter table profiles
add column if not exists accessibility_prefs jsonb not null default '{}'::jsonb;
```

### Core Logic
- Read and patch profile preferences.
- Persist toggle states server-side.

### TODO
- [ ] Add avatar upload to storage bucket.
- [ ] Add sign-out and account deletion flows.
- [ ] Add accessibility preset templates.

## 8. User Feedback Screen

### Frontend Scope
- Category tabs.
- Sentiment picker.
- Rich text message.
- Optional photo attachment.

### Frontend Code
```tsx
// app/feedback/index.tsx
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text, TextInput, Pressable } from 'react-native';

const schema = z.object({
  category: z.enum(['general', 'report_error', 'suggestion']),
  sentiment: z.number().min(1).max(5),
  message: z.string().min(10),
});

type FormType = z.infer<typeof schema>;

export default function FeedbackScreen() {
  const { control, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'general', sentiment: 3, message: '' },
  });

  return (
    <View className="flex-1 bg-background px-5 pt-4">
      <Text className="text-2xl font-bold text-primary">User Feedback</Text>
      <Controller
        control={control}
        name="message"
        render={({ field: { value, onChange } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={5}
            placeholder="Describe your experience"
            className="mt-4 rounded-3xl bg-surface-variant px-4 py-4"
          />
        )}
      />
      <Pressable className="mt-6 rounded-full bg-tertiary px-5 py-4" onPress={handleSubmit((values) => console.log(values))}>
        <Text className="text-center font-bold text-on-tertiary">Submit Feedback</Text>
      </Pressable>
    </View>
  );
}
```

### Backend Code
```sql
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  category text not null,
  sentiment int not null check (sentiment between 1 and 5),
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
```

### Core Logic
- Validate client payload with Zod.
- Insert feedback row and optional attachment record.
- Show success and route back to home.

### TODO
- [ ] Add image picker and storage upload.
- [ ] Add anti-spam rate limiting in edge function.
- [ ] Add in-app feedback status tracker.

## 9. Admin Console Pages (In-App)

## 9.1 Admin Login

### Frontend Scope
- Sign-in with role check.

### Backend Scope
- Validate role from profiles table after auth.

### TODO
- [ ] Block non-admin users immediately.
- [ ] Add audit log for admin login.

## 9.2 Admin Dashboard

### Frontend Scope
- KPI cards: active users, open feedback, occupancy spikes.
- Time-series chart and campus heat hints.

### Backend Code
```sql
create or replace view public.v_admin_kpis as
select
  (select count(*) from profiles) as total_users,
  (select count(*) from feedback where status = 'open') as open_feedback,
  (select count(*) from buildings where is_active = true) as active_buildings;
```

### TODO
- [ ] Add date range and campus filters.
- [ ] Add alert cards for anomaly occupancy.

## 9.3 Building Management

### Frontend Scope
- List, create, edit, deactivate buildings.
- Manage floors and room imports.

### Backend Scope
- Use edge function for privileged writes.

### TODO
- [ ] Add CSV import validation and preview.
- [ ] Add map coordinate picker.

## 9.4 Occupancy Control

### Frontend Scope
- Live occupancy dashboard.
- Manual correction controls for admin.

### Backend Scope
- occupancy_live upsert + history insert trigger.

### TODO
- [ ] Add realtime channel for occupancy updates.
- [ ] Add threshold alerts for crowded buildings.

## 9.5 Feedback Moderation

### Frontend Scope
- Queue grouped by status.
- Triage actions: resolve, reject, request details.

### Backend Code
```sql
create table if not exists feedback_actions (
  id bigserial primary key,
  feedback_id uuid not null references feedback(id),
  admin_id uuid not null references profiles(id),
  action text not null,
  note text,
  created_at timestamptz not null default now()
);
```

### TODO
- [ ] Add SLA timers for unresolved issues.
- [ ] Add canned response templates.

## 10. Cross-Page Integration TODOs
- [ ] Add shared error boundary and retry actions.
- [ ] Add optimistic updates for favorites and quick actions.
- [ ] Add route deep links from notifications.
- [ ] Add offline cache hydration and stale indicators.
- [ ] Add per-screen analytics events.
- [ ] Add accessibility test pass for all controls.

## 11. Implementation Rule
No page is considered complete until:
- TypeScript strict passes.
- React Query hooks return typed data only.
- Zod validation exists for all mutation payloads.
- Supabase policy coverage is verified.
- Loading, empty, and error states are implemented.
