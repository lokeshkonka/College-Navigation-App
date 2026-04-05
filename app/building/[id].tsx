import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
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
      <View style={styles.stateRoot}>
        <Text style={styles.stateText}>Loading building details...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.stateRoot}>
        <Text style={styles.stateText}>Building details are unavailable right now.</Text>
      </View>
    );
  }

  const originId = MOCK_BUILDINGS[0]?.id ?? data.id;

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.subtitle}>{data.code}</Text>
      <Text style={styles.description}>{data.description}</Text>

      <ClayCard style={styles.metricsCard}>
        <Text style={styles.metaLabel}>Live Occupancy</Text>
        <OccupancyBadge percent={data.occupancy_percent} />
      </ClayCard>

      <ClayCard style={styles.hoursCard}>
        <Text style={styles.metaLabel}>Hours</Text>
        {Object.entries(data.hours_json ?? {}).map(([day, hours]) => (
          <View key={day} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{day.toUpperCase()}</Text>
            <Text style={styles.hoursTime}>{hours}</Text>
          </View>
        ))}
      </ClayCard>

      <Pressable
        onPress={() =>
          router.push({ pathname: '/route', params: { originId, destinationId: data.id, accessible: 'true' } })
        }
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>Start Route</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
    minHeight: '100%',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.section
  },
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '700'
  },
  description: {
    color: theme.colors.primary,
    fontSize: 16,
    marginTop: 6
  },
  metricsCard: {
    marginTop: theme.spacing.md
  },
  hoursCard: {
    marginTop: theme.spacing.sm
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase'
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  hoursDay: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  hoursTime: {
    color: theme.colors.textMuted
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.tertiary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.section,
    paddingVertical: theme.spacing.md
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  stateRoot: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.section
  },
  stateText: {
    color: theme.colors.primary,
    textAlign: 'center'
  }
});
