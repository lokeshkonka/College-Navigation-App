# College Navigation App

A professional React Native app built with Expo for campus navigation, featuring real-time occupancy tracking, turn-by-turn routing, and an integrated admin console.

## ✨ Features

### Student/Staff Features
- **Smart Search**: Find buildings, rooms, and facilities with instant search and filters
- **Interactive Map**: Campus map with building markers and current location tracking
- **Turn-by-Turn Navigation**: Step-by-step routing with distance and time estimates
- **Real-Time Occupancy**: Live building occupancy data to avoid crowds
- **Personalized Experience**: Recent destinations, favorites, and customizable preferences
- **Accessibility First**: High contrast mode, screen reader support, and accessibility preferences
- **Feedback System**: Submit feedback with photos and track status

### Admin Features
- **Dashboard**: KPIs and analytics for campus activity
- **Building Management**: CRUD operations for buildings, floors, and rooms
- **Occupancy Control**: Manage and monitor real-time occupancy data
- **Feedback Moderation**: Review and respond to user feedback

## 🎨 Design System

Built with **Stitch UI** principles featuring:
- Claymorphic cards with soft shadows and depth
- Glassmorphic headers and navigation
- Sunken inputs for tactile interaction
- Professional color palette and typography
- Smooth animations and transitions

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript (strict mode)
- **Backend**: Supabase (PostgreSQL + Realtime + Storage + Auth)
- **State Management**: Zustand + React Query (TanStack Query)
- **Navigation**: Expo Router (file-based routing)
- **Form Validation**: React Hook Form + Zod schemas
- **UI Components**: Custom component library (14+ components)
- **Testing**: Vitest for unit/integration tests
- **Code Quality**: ESLint + TypeScript strict + Prettier

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Studio
- Supabase account and project

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lokeshkonka/College-Navigation-App.git
   cd College-Navigation-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
   ```

4. **Set up Supabase database**

   Run migrations in your Supabase project:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/migrations/20260405_0001_core_schema.sql
   supabase/migrations/20260405_0002_admin_views.sql

   # Optional: Load seed data
   supabase/seeds/seed.sql
   ```

5. **Start the app**
   ```bash
   npm start
   ```

   Then press:
   - `i` for iOS simulator
   - `a` for Android emulator
   - `w` for web browser

## 🧪 Development

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in web browser

npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript compiler check
npm run test       # Run test suite
npm run qa:full    # Run all quality checks (lint + typecheck + test + build)
```

### Project Structure

```
College-Navigation-App/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   ├── (tabs)/              # Main tab navigation
│   ├── admin/               # Admin console
│   ├── building/            # Building details
│   ├── route/               # Turn-by-turn routing
│   ├── search/              # Search screen
│   └── feedback/            # Feedback submission
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Core UI components (Button, Card, Input, etc.)
│   │   ├── providers/      # React Context providers
│   │   └── admin/          # Admin-specific components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication logic
│   │   ├── buildings/      # Building data and APIs
│   │   ├── routes/         # Routing algorithms
│   │   ├── occupancy/      # Real-time occupancy
│   │   └── feedback/       # Feedback system
│   ├── lib/                # Shared utilities
│   │   ├── constants/      # Theme, colors, spacing
│   │   └── hooks/          # Custom React hooks
│   ├── services/           # External services
│   │   └── supabase/       # Supabase client
│   └── types/              # TypeScript type definitions
├── supabase/               # Database schema and migrations
├── tests/                  # Test files
└── Docs/                   # Architecture and planning docs
```

## 🔐 Authentication

The app uses Supabase Auth with email/password authentication.

**Default test accounts** (after running seed data):
- **Admin**: admin@college.edu / admin123
- **Student**: student@college.edu / student123

## 🚀 Deployment

### Build for Production

```bash
# Android APK (preview)
npm run build:apk

# Check build status
npm run build:list

# Production build with EAS
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

### Environment Configuration

Set up environment-specific Supabase projects:
- **Development**: Local Supabase or dev project
- **Staging**: Staging Supabase project
- **Production**: Production Supabase project

Update `eas.json` with environment-specific variables.

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles with roles and preferences
- `buildings` - Campus buildings with coordinates
- `floors` - Building floors and rooms
- `occupancy_live` - Real-time occupancy data
- `occupancy_history` - Historical occupancy tracking
- `routes_history` - User navigation history
- `favorites` - User-favorited locations
- `feedback` - User feedback submissions
- `recent_destinations` - Recently visited places

### Row Level Security (RLS)
All tables have RLS policies enforcing:
- Students/staff: Read access to public data, write access to own data
- Admins: Full CRUD on all tables
- Super admins: Elevated permissions

## 🎯 Roadmap

### Phase 1: Critical Features (Current)
- [x] UI/UX design system
- [x] Authentication flow
- [x] Database schema with RLS
- [x] Core screens (Home, Search, Map, Building Details, Route, Profile, Feedback)
- [x] Admin console
- [x] TypeScript strict mode compliance

### Phase 2: Integration & Polish
- [ ] Real map rendering with react-native-maps
- [ ] Supabase Storage integration for images
- [ ] Avatar upload in profile
- [ ] Photo attachments in feedback
- [ ] Wire realtime occupancy updates
- [ ] Enhanced routing algorithm

### Phase 3: Testing & QA
- [ ] Component test coverage
- [ ] Integration test suite
- [ ] E2E smoke tests
- [ ] Accessibility audit
- [ ] Performance optimization

### Phase 4: Production Release
- [ ] Production environment setup
- [ ] App store preparation
- [ ] Analytics and monitoring
- [ ] User documentation

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm run qa:full`
3. Commit with descriptive message: `git commit -m "Add feature X"`
4. Push and create Pull Request

### Code Quality Standards
- All TypeScript must pass strict mode
- ESLint must pass with zero errors
- Write tests for new features
- Follow the existing design system
- Update documentation for API changes

## 📝 License

This project is proprietary and confidential.

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues to report bugs or request features.

## 👥 Team

- **Architecture**: Lokesh Konka
- **UI/UX Design**: Based on Stitch UI system
- **Development**: Full-stack React Native + Supabase

## 📚 Additional Documentation

- [Architecture Guide](Docs/Architecture.md) - Technical architecture and design decisions
- [Pages Implementation](Docs/Pages.md) - Detailed screen specifications
- [Development Plan](Docs/plan.md) - Step-by-step build plan
- [Agent Tasks](Docs/AI-Agent-Tasks.md) - Modular task breakdown

---

**Built with ❤️ using React Native and Supabase**
