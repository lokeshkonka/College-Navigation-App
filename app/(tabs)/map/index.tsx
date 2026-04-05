import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
import { getMapPoints } from '@/features/map/api/getMapPoints';
import { theme } from '@/lib/constants/theme';

export default function MapScreen() {
  const { data = [], isPending, isError } = useQuery({
    queryKey: ['map-points'],
    queryFn: getMapPoints,
    staleTime: 5 * 60_000
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
            <MaterialIcons name="mic" size={22} color={theme.colors.outline} />
          </View>
        </Pressable>

        {/* Map Canvas */}
        <View style={styles.mapContainer}>
          <View style={styles.mapCanvas}>
            <Text style={styles.mapCanvasText}>Campus Map View</Text>
            <Text style={styles.mapCanvasSubtext}>Interactive map renders here</Text>
          </View>

          {/* Map Overlay Card */}
          <View style={styles.mapOverlay}>
            <ClayCard style={styles.routeCard}>
              <View style={styles.routeHeader}>
                <Chip label="Fastest Route" variant="tertiary" size="small" />
                <Text style={styles.routeTime}>8 min walk</Text>
              </View>
              <Text style={styles.routeTitle}>Engineering Quad</Text>
              <View style={styles.routeDetails}>
                <MaterialIcons name="near-me" size={16} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.routeText}>via Main Boulevard • 450m</Text>
              </View>
              <Pressable style={styles.startButton}>
                <Text style={styles.startButtonText}>Start Route</Text>
                <MaterialIcons name="directions-walk" size={20} color="#ffffff" />
              </Pressable>
            </ClayCard>

            {/* Nearby Services */}
            <View style={styles.servicesGrid}>
              <Pressable style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <MaterialIcons name="local-cafe" size={24} color={theme.colors.tertiary} />
                </View>
                <Text style={styles.serviceLabel}>Cafes</Text>
              </Pressable>
              <Pressable style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <MaterialIcons name="menu-book" size={24} color={theme.colors.tertiary} />
                </View>
                <Text style={styles.serviceLabel}>Studying</Text>
              </Pressable>
              <Pressable style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <MaterialIcons name="local-hospital" size={24} color={theme.colors.tertiary} />
                </View>
                <Text style={styles.serviceLabel}>Clinic</Text>
              </Pressable>
              <Pressable style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <MaterialIcons name="print" size={24} color={theme.colors.tertiary} />
                </View>
                <Text style={styles.serviceLabel}>Printing</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Campus Locations List */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Campus Locations</Text>

          {isPending ? (
            <Text style={styles.stateText}>Loading locations...</Text>
          ) : isError ? (
            <Text style={styles.stateText}>Unable to load locations</Text>
          ) : data.length === 0 ? (
            <Text style={styles.stateText}>No locations available</Text>
          ) : (
            <View style={styles.locationsList}>
              {data.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => router.push({ pathname: '/building/[id]', params: { id: item.id } })}
                >
                  <ClayCard style={styles.locationCard}>
                    <View style={styles.locationIconContainer}>
                      <MaterialIcons name="location-on" size={24} color={theme.colors.tertiary} />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationTitle}>{item.name}</Text>
                      <Text style={styles.locationCoords}>
                        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                      </Text>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color={theme.colors.outlineVariant}
                    />
                  </ClayCard>
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
    paddingTop: 110,
    paddingBottom: 120
  },
  searchSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.xl
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
  mapContainer: {
    position: 'relative',
    marginBottom: theme.spacing['4xl']
  },
  mapCanvas: {
    height: 400,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapCanvasText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  mapCanvasSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  mapOverlay: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.screenPadding,
    right: theme.spacing.screenPadding
  },
  routeCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceContainerLowest
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant
  },
  routeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: -0.5
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.full,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff'
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  serviceCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center'
  },
  serviceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  locationsSection: {
    paddingHorizontal: theme.spacing.screenPadding
  },
  sectionTitle: {
    fontSize: 11,
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
  locationsList: {
    gap: theme.spacing.md
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationInfo: {
    flex: 1
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2
  },
  locationCoords: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  }
});
