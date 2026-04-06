import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
import { OccupancyBadge } from '@/components/ui/OccupancyBadge';
import { getBuildingById } from '@/features/buildings/api/getBuildingById';
import { MOCK_BUILDINGS } from '@/lib/constants/mockData';
import { theme } from '@/lib/constants/theme';

export default function BuildingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = useQuery({
    queryKey: ['building', id],
    queryFn: () => getBuildingById(id),
    enabled: Boolean(id)
  });

  if (isPending) {
    return (
      <View style={styles.root}>
        <FloatingHeader title="Tactile Cartographer" showBack showMenu={false} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Loading building details...</Text>
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.root}>
        <FloatingHeader title="Tactile Cartographer" showBack showMenu={false} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Building details are unavailable right now.</Text>
        </View>
      </View>
    );
  }

  const originId = MOCK_BUILDINGS[0]?.id ?? data.id;

  return (
    <View style={styles.root}>
      <FloatingHeader title="Tactile Cartographer" showBack showMenu={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <View style={styles.heroImage}>
            <View style={styles.heroPlaceholder}>
              <MaterialIcons name="domain" size={64} color={theme.colors.onSurfaceVariant} />
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Chip label="Open Now" variant="tertiary" size="small" />
          </View>
        </View>

        {/* Building Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{data.name}</Text>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color={theme.colors.onSurfaceVariant} />
            <Text style={styles.locationText}>North Campus • Zone 4</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{data.description}</Text>

        {/* Floor Selector */}
        <View style={styles.floorSection}>
          <Text style={styles.sectionLabel}>Explore Floors</Text>
          <View style={styles.floorButtons}>
            <Pressable style={styles.floorButton}>
              <Text style={styles.floorButtonText}>G</Text>
            </Pressable>
            <Pressable style={[styles.floorButton, styles.floorButtonActive]}>
              <Text style={[styles.floorButtonText, styles.floorButtonTextActive]}>1</Text>
            </Pressable>
            <Pressable style={styles.floorButton}>
              <Text style={styles.floorButtonText}>2</Text>
            </Pressable>
            <Pressable style={styles.floorButton}>
              <Text style={styles.floorButtonText}>3</Text>
            </Pressable>
          </View>
        </View>

        {/* Current Occupancy */}
        <ClayCard style={styles.occupancyCard}>
          <View style={styles.occupancyHeader}>
            <Text style={styles.cardTitle}>Current Occupancy</Text>
            <MaterialIcons name="people" size={20} color={theme.colors.primary} />
          </View>
          <View style={styles.occupancyContent}>
            <Text style={styles.occupancyPercent}>{data.occupancy_percent}%</Text>
            <View style={styles.occupancyBadgeContainer}>
              <OccupancyBadge percent={data.occupancy_percent} />
            </View>
          </View>
        </ClayCard>

        {/* Facilities */}
        <ClayCard style={styles.facilitiesCard}>
          <Text style={styles.cardTitle}>Facilities</Text>
          <View style={styles.facilitiesList}>
            <View style={styles.facilityItem}>
              <MaterialIcons name="wifi" size={20} color={theme.colors.tertiary} />
              <Text style={styles.facilityText}>High-Speed Web</Text>
            </View>
            <View style={styles.facilityItem}>
              <MaterialIcons name="local-cafe" size={20} color={theme.colors.tertiary} />
              <Text style={styles.facilityText}>Artisan Cafe</Text>
            </View>
            <View style={styles.facilityItem}>
              <MaterialIcons name="view-in-ar" size={20} color={theme.colors.tertiary} />
              <Text style={styles.facilityText}>3D Lab</Text>
            </View>
          </View>
        </ClayCard>

        {/* Building Overview */}
        <View style={styles.overviewSection}>
          <View style={styles.overviewIcon}>
            <MaterialIcons name="info" size={24} color={theme.colors.tertiary} />
          </View>
          <View style={styles.overviewContent}>
            <Text style={styles.overviewTitle}>Building Overview</Text>
            <Text style={styles.overviewText}>
              The Nexus Center was completed in 2022 and serves as a beacon of modern educational
              architecture. It spans over 45,000 square feet with a focus on cross-disciplinary
              collaboration.
            </Text>
            <View style={styles.badgesRow}>
              <Chip label="LEED Gold" variant="success" size="small" />
              <Chip label="Accessibility A+" variant="secondary" size="small" />
            </View>
          </View>
        </View>

        {/* Featured Space */}
        <View style={styles.featuredSpace}>
          <View style={styles.featuredImage}>
            <View style={styles.featuredPlaceholder}>
              <MaterialIcons name="auto-stories" size={48} color={theme.colors.onSurfaceVariant} />
            </View>
          </View>
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>Quiet Study Zone</Text>
            <Text style={styles.featuredSubtitle}>Floor 3 • West Wing</Text>
          </View>
        </View>

        {/* Ready to Go Card */}
        <ClayCard style={styles.readyCard}>
          <View style={styles.readyContent}>
            <View style={styles.readyIcon}>
              <MaterialIcons name="navigation" size={24} color={theme.colors.tertiary} />
            </View>
            <View style={styles.readyInfo}>
              <Text style={styles.readyTitle}>Ready to go?</Text>
              <Text style={styles.readySubtitle}>Estimated time: 4 mins from current spot</Text>
            </View>
          </View>
          <Button
            onPress={() =>
              router.push({
                pathname: '/route',
                params: { originId, destinationId: data.id, accessible: 'true' }
              })
            }
            variant="primary"
            icon="directions-walk"
            fullWidth
          >
            Start Route
          </Button>
        </ClayCard>
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding
  },
  stateText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center'
  },
  heroContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xl
  },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: theme.colors.surfaceContainerHigh
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerHigh
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.screenPadding
  },
  titleSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.lg
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
    marginBottom: theme.spacing.sm
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.onSurface,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['4xl']
  },
  floorSection: {
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['3xl']
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.lg
  },
  floorButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md
  },
  floorButton: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant
  },
  floorButtonActive: {
    backgroundColor: theme.colors.tertiary,
    borderColor: theme.colors.tertiary
  },
  floorButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary
  },
  floorButtonTextActive: {
    color: '#ffffff'
  },
  occupancyCard: {
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceContainerLowest
  },
  occupancyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary
  },
  occupancyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  occupancyPercent: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.tertiary,
    letterSpacing: -1
  },
  occupancyBadgeContainer: {
    transform: [{ scale: 1.2 }]
  },
  facilitiesCard: {
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['3xl'],
    backgroundColor: theme.colors.tertiaryContainer,
    opacity: 0.9
  },
  facilitiesList: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onTertiaryContainer
  },
  overviewSection: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['3xl']
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  overviewContent: {
    flex: 1
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm
  },
  overviewText: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: theme.spacing.lg
  },
  badgesRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap'
  },
  featuredSpace: {
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['3xl'],
    borderRadius: theme.radii.xl,
    overflow: 'hidden',
    position: 'relative'
  },
  featuredImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceContainerHigh
  },
  featuredPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceContainerHigh
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: theme.spacing.xs
  },
  featuredSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  readyCard: {
    marginHorizontal: theme.spacing.screenPadding,
    marginBottom: theme.spacing['4xl'],
    backgroundColor: theme.colors.surfaceContainerLowest
  },
  readyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl
  },
  readyIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  readyInfo: {
    flex: 1
  },
  readyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs
  },
  readySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  }
});
