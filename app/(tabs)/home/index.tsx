import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
import { getRecentDestinations } from '@/features/navigation/api/getRecentDestinations';
import { theme } from '@/lib/constants/theme';

export default function HomeScreen() {
  const { data = [], isPending, isError } = useQuery({
    queryKey: ['recent-destinations'],
    queryFn: getRecentDestinations
  });

  return (
    <View style={styles.root}>
      <FloatingHeader title="Tactile Cartographer" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <Pressable onPress={() => router.push('/search')} style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color={theme.colors.outline} />
            <Text style={styles.searchPlaceholder}>Where to, explorer?</Text>
          </View>
        </Pressable>

        {/* Current Status Card */}
        <ClayCard style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.statusLabel}>Current Status</Text>
              <Text style={styles.statusTitle}>Main Library</Text>
            </View>
            <Chip label="On Campus" variant="tertiary" size="small" />
          </View>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>📍 Campus Map</Text>
          </View>
        </ClayCard>

        {/* Main Navigation Cards */}
        <View style={styles.navigationSection}>
          {/* Navigate Card - Large */}
          <ClayCard
            onPress={() => router.push('/search')}
            style={styles.navigateCard}
          >
            <View style={styles.navigateCardContent}>
              <View>
                <Text style={styles.navigateTitle}>Navigate</Text>
                <Text style={styles.navigateSubtitle}>Find your next lecture hall</Text>
              </View>
              <View style={styles.navigateIcon}>
                <MaterialIcons name="near-me" size={28} color={theme.colors.onTertiary} />
              </View>
            </View>
          </ClayCard>

          {/* Grid - Timetable and Nearby */}
          <View style={styles.smallCardsGrid}>
            <ClayCard
              onPress={() => {}}
              style={styles.smallCard}
            >
              <View style={styles.smallCardIcon}>
                <MaterialIcons name="calendar-today" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.smallCardTitle}>Timetable</Text>
              <Text style={styles.smallCardSubtitle}>Next: Bio 101 @ 2PM</Text>
            </ClayCard>

            <ClayCard
              onPress={() => {}}
              style={styles.smallCard}
            >
              <View style={styles.smallCardIcon}>
                <MaterialIcons name="explore" size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.smallCardTitle}>Nearby</Text>
              <Text style={styles.smallCardSubtitle}>Coffee, ATMs, Labs</Text>
            </ClayCard>
          </View>
        </View>

        {/* Recent Destinations */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Destinations</Text>

          {isPending ? (
            <Text style={styles.stateText}>Loading recent destinations...</Text>
          ) : isError ? (
            <Text style={styles.stateText}>Could not load history</Text>
          ) : data.length === 0 ? (
            <Text style={styles.stateText}>No recent destinations yet</Text>
          ) : (
            <View style={styles.recentList}>
              {data.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    router.push({ pathname: '/building/[id]', params: { id: item.building_id } })
                  }
                  style={({ pressed }) => [
                    styles.recentItem,
                    pressed && styles.recentItemPressed
                  ]}
                >
                  <View style={styles.recentIconContainer}>
                    <MaterialIcons name="history" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentTitle}>{item.building_name}</Text>
                    <Text style={styles.recentMeta}>{item.relative_time}</Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color={theme.colors.outlineVariant}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 110, // Account for floating header
    paddingHorizontal: theme.spacing.screenPadding,
    paddingBottom: 120 // Account for bottom nav
  },
  searchSection: {
    marginBottom: theme.spacing['4xl']
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: '#2b3438',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.outlineVariant,
    flex: 1
  },
  statusCard: {
    marginBottom: theme.spacing['4xl']
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: theme.spacing.xs
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5
  },
  mapPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  mapPlaceholderText: {
    fontSize: 24
  },
  navigationSection: {
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['4xl']
  },
  navigateCard: {
    backgroundColor: theme.colors.surfaceContainerLowest
  },
  navigateCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navigateTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  navigateSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  navigateIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.tertiary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  smallCardsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.xl
  },
  smallCard: {
    flex: 1,
    aspectRatio: 1
  },
  smallCardIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  smallCardSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16
  },
  recentSection: {
    marginBottom: theme.spacing['4xl']
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xl
  },
  stateText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: theme.spacing.xl
  },
  recentList: {
    gap: theme.spacing.lg
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.sm
  },
  recentItemPressed: {
    opacity: 0.7
  },
  recentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2b3438',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0
  },
  recentInfo: {
    flex: 1
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2
  },
  recentMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  }
});
