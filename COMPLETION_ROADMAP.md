# College Navigation App - Completion Roadmap

## Executive Summary

**Current Status**: The app is ~70% complete with professional UI/UX fully implemented. Core infrastructure and screens are built, but critical integrations and production readiness tasks remain.

**Recent Achievements** ✅:
- Fixed TypeScript build errors (P0 blocker resolved)
- Created comprehensive README documentation
- Added .env.example template
- All TypeScript checks passing with zero errors

---

## 🎯 Remaining Tasks for Production Release

### PHASE 1: Critical Feature Integrations (Est: 2-3 days)

#### 1. Real Map Rendering ⚠️ HIGH PRIORITY
**Status**: Placeholder text only
**Impact**: Core navigation feature
**Implementation**:
```bash
# Install react-native-maps
npx expo install react-native-maps

# Update app/(tabs)/map/index.tsx to use real MapView
# Add building markers from database
# Wire marker tap to building details navigation
# Add current location tracking
```

**Files to modify**:
- `app/(tabs)/map/index.tsx` - Replace placeholder with MapView
- `src/features/buildings/api/getMapPoints.ts` - Fetch building coordinates
- `src/components/map/BuildingMarker.tsx` - Create custom marker component

**Acceptance Criteria**:
- Map renders campus with correct center coordinates
- Building markers appear and are clickable
- Tapping marker navigates to building details
- Current location indicator shows user position

---

#### 2. Supabase Storage Configuration ⚠️ BLOCKER
**Status**: Buckets not created
**Impact**: Blocks avatar and feedback photo uploads

**Implementation**:
```sql
-- In Supabase Dashboard > Storage, create buckets:

-- 1. Avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Feedback photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-photos', 'feedback-photos', false);

CREATE POLICY "Feedback photos visible to admins and owner"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'feedback-photos' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
);

-- 3. Floor maps bucket (public, admin-only uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('floor-maps', 'floor-maps', true);

CREATE POLICY "Floor maps publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'floor-maps');

CREATE POLICY "Only admins can upload floor maps"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'floor-maps' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
```

**Acceptance Criteria**:
- Three buckets created: avatars, feedback-photos, floor-maps
- RLS policies enforce proper access control
- Test upload/download works from app

---

#### 3. Avatar Upload Feature
**Status**: Static placeholder icon
**Impact**: User personalization

**Implementation**:
```typescript
// src/features/profile/api/uploadAvatar.ts
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supabase/client';

export async function pickAndUploadAvatar(userId: string) {
  // Request permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission denied');
  }

  // Pick image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;

  // Upload to Supabase Storage
  const file = result.assets[0];
  const fileExt = file.uri.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: `image/${fileExt}`,
    name: fileName,
  } as any);

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, formData, { upsert: true });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update profile
  await supabase
    .from('profiles')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', userId);

  return urlData.publicUrl;
}
```

**Files to modify**:
- `app/(tabs)/profile/index.tsx` - Add image picker button
- `src/features/profile/api/uploadAvatar.ts` - Create upload function
- `src/components/ui/Avatar.tsx` - Create avatar component with fallback

**Acceptance Criteria**:
- User can tap avatar to select new image
- Image uploads to Supabase Storage
- Avatar updates in real-time across app
- Fallback initials shown if no avatar

---

#### 4. Feedback Photo Attachment
**Status**: Form exists, no photo upload
**Impact**: Enhanced feedback quality

**Implementation**: Similar to avatar upload above, but:
- Allow multiple photos (up to 3)
- Store photo URLs in feedback table
- Display thumbnails in feedback list

**Files to modify**:
- `app/feedback/index.tsx` - Add photo picker
- `src/features/feedback/api/submitFeedback.ts` - Upload photos before saving feedback
- `src/types/domain.ts` - Add photo_urls to FeedbackInput type

---

#### 5. Wire Realtime Occupancy Updates
**Status**: Subscription code exists but not wired to UI
**Impact**: Live occupancy data

**Implementation**:
```typescript
// In app/building/[id].tsx
import { useEffect } from 'react';
import { supabase } from '@/services/supabase/client';

// Inside component:
useEffect(() => {
  const channel = supabase
    .channel(`occupancy:${buildingId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'occupancy_live',
        filter: `building_id=eq.${buildingId}`,
      },
      (payload) => {
        // Update local state with new occupancy data
        queryClient.setQueryData(['building', buildingId], (old: any) => ({
          ...old,
          occupancy_percent: payload.new.occupancy_percent,
        }));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [buildingId]);
```

**Files to modify**:
- `app/building/[id].tsx` - Add realtime subscription
- `app/(tabs)/home/index.tsx` - Subscribe to favorite buildings

**Acceptance Criteria**:
- Occupancy updates live without refresh
- Visual indicator shows when data is updating
- Subscription cleans up on unmount

---

### PHASE 2: Enhanced Functionality (Est: 1-2 days)

#### 6. Improved Routing Algorithm
**Status**: Mock algorithm with hardcoded steps
**Current**: `src/features/routes/api/getBestRoute.ts`

**Options**:
A. **Simple Enhancement** (Quick win):
   - Calculate actual distance using Haversine formula
   - Generate basic waypoints between buildings
   - Add accessibility routing (avoid stairs)

B. **Full Integration** (Recommended):
   - Integrate OpenRouteService API
   - Use campus-specific routing graph
   - Support indoor navigation

**Implementation (Option A)**:
```typescript
// src/lib/utils/distance.ts
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Update getBestRoute to use real coordinates
```

---

### PHASE 3: Testing & Quality Assurance (Est: 2-3 days)

#### 7. Test Coverage
**Current**: ~20% coverage (only schema and mock E2E tests)
**Target**: 60%+ coverage

**Priority Tests**:

```typescript
// tests/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(<Button onPress={() =>{}}>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} loading>Click</Button>
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

**Test Categories**:
1. **Unit Tests** (20+ tests):
   - All UI components (Button, ClayCard, TextInput, etc.)
   - Validation schemas (Zod)
   - Utility functions (distance calculation, date formatting)

2. **Integration Tests** (10+ tests):
   - Auth flow (sign-in, sign-up, sign-out)
   - Building search and filter
   - Feedback submission
   - Admin CRUD operations

3. **E2E Tests** (5+ critical paths):
   - User journey: Search → Building Details → Start Route
   - Admin journey: Login → Building Management → Update Occupancy
   - Feedback journey: Submit → Admin Moderates → User sees status

**Tools to set up**:
```bash
# For React Native component testing
npm install --save-dev @testing-library/react-native @testing-library/jest-native

# For E2E testing (choose one):
# Option A: Maestro (recommended for mobile)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Option B: Detox
npm install --save-dev detox
```

---

#### 8. Performance Optimization

**Areas to optimize**:

1. **FlatList Virtualization**:
```typescript
// In search results and recent destinations
<FlatList
  data={buildings}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

2. **Image Optimization**:
```typescript
// Use expo-image for better performance
import { Image } from 'expo-image';

<Image
  source={{ uri: building.photo_url }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>
```

3. **Code Splitting** (Lazy load heavy screens):
```typescript
// app/_layout.tsx
const AdminLayout = lazy(() => import('./admin/_layout'));
const BuildingDetails = lazy(() => import('./building/[id]'));
```

4. **React Query Optimization**:
```typescript
// Configure better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

---

### PHASE 4: Production Readiness (Est: 1 day)

#### 9. Environment Configuration

**Create multiple environments**:

```javascript
// .env.development
EXPO_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=dev_anon_key
EXPO_PUBLIC_APP_ENV=development

// .env.staging
EXPO_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=staging_anon_key
EXPO_PUBLIC_APP_ENV=staging

// .env.production
EXPO_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=prod_anon_key
EXPO_PUBLIC_APP_ENV=production
```

**Update eas.json**:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "development"
      }
    },
    "staging": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    }
  }
}
```

---

#### 10. Final QA Checklist

**Before launch, verify**:

- [ ] **TypeScript**: `npm run typecheck` passes ✅ (DONE)
- [ ] **Linting**: `npm run lint` passes (18 warnings to fix)
- [ ] **Tests**: `npm run test` passes with 60%+ coverage
- [ ] **Build**: `npm run build:web` succeeds
- [ ] **Manual Testing**:
  - [ ] Sign up / Sign in / Sign out
  - [ ] Search buildings
  - [ ] View building details
  - [ ] Start navigation
  - [ ] Submit feedback
  - [ ] Admin can CRUD buildings
  - [ ] Admin can moderate feedback
  - [ ] Realtime occupancy updates
  - [ ] Avatar upload works
  - [ ] Photo attachment in feedback works
- [ ] **Accessibility**:
  - [ ] All interactive elements have accessibility labels
  - [ ] Screen reader navigation works
  - [ ] High contrast mode works
  - [ ] Font scaling works (Settings > Display > Text Size)
- [ ] **Performance**:
  - [ ] App boots in < 3 seconds
  - [ ] Search results appear in < 500ms
  - [ ] Map loads in < 2 seconds
  - [ ] No memory leaks in long sessions
- [ ] **Security**:
  - [ ] No secrets in code or .env files
  - [ ] RLS policies enforced
  - [ ] API keys properly scoped
  - [ ] HTTPS only
- [ ] **App Store**:
  - [ ] App icons for all sizes
  - [ ] Splash screens for all devices
  - [ ] Privacy policy
  - [ ] Terms of service
  - [ ] App description and screenshots

---

## 📊 Progress Tracking

### Overall Completion: 70%

| Category | Status | Progress |
|----------|--------|----------|
| **UI/UX Design** | Complete | 100% ✅ |
| **Core Screens** | Complete | 100% ✅ |
| **Database Schema** | Complete | 100% ✅ |
| **TypeScript Setup** | Complete | 100% ✅ |
| **Documentation** | Complete | 100% ✅ |
| **Map Integration** | Not Started | 0% |
| **Storage & Images** | Not Started | 0% |
| **Realtime Features** | Partial | 50% |
| **Routing Algorithm** | Mock Only | 30% |
| **Test Coverage** | Minimal | 20% |
| **Performance** | Not Optimized | 40% |
| **Production Setup** | Not Configured | 0% |

---

## 🚀 Recommended Execution Order (Next Steps)

### Week 1: Core Integrations
1. **Day 1-2**: Set up Supabase Storage + Implement Avatar Upload
2. **Day 3**: Implement Photo Attachments in Feedback
3. **Day 4-5**: Integrate Real Map Rendering (react-native-maps)

### Week 2: Functionality & Polish
4. **Day 6**: Wire Realtime Occupancy Subscriptions
5. **Day 7**: Enhance Routing Algorithm
6. **Day 8-9**: Write Test Suite (Target: 60% coverage)
7. **Day 10**: Performance Optimization Pass

### Week 3: Production Prep
8. **Day 11-12**: Set up Production Environment & EAS Build
9. **Day 13**: Full E2E Smoke Testing
10. **Day 14**: Final QA, Fix Critical Bugs, App Store Prep

---

## 💡 Quick Wins (Can be done immediately)

1. **Fix ESLint Warnings** (18 warnings):
   - Remove unused imports
   - Fix `@ts-ignore` → `@ts-expect-error`
   - Remove unused variables
   - **Time**: 30 minutes

2. **Enhance Mock Routing**:
   - Add real distance calculation
   - Generate dynamic waypoints
   - **Time**: 1 hour

3. **Add Loading Skeletons**:
   - Replace simple loading indicators with skeleton screens
   - **Time**: 2 hours

4. **Dark Mode**:
   - Wire existing toggle to theme context
   - **Time**: 2 hours

5. **Analytics Integration**:
   - Add Expo Analytics or PostHog
   - **Time**: 1 hour

---

## 🔥 Critical Blockers (Do These First)

1. **Supabase Storage Setup** - Blocks avatar & photo uploads
2. **Map Integration** - Core feature, high visibility
3. **Test Coverage** - Required for confidence in production

---

## 📞 Support & Next Steps

**For Questions**:
- Review detailed docs in `Docs/` folder
- Check `Docs/Pages.md` for screen specifications
- Reference `Docs/Architecture.md` for technical decisions

**To Continue Development**:
1. Pick tasks from "Week 1: Core Integrations" above
2. Create feature branches: `git checkout -b feature/map-integration`
3. Test locally: `npm run qa:full`
4. Commit and push for review

---

**Last Updated**: 2026-04-06
**Status**: Ready for Phase 2 Implementation
