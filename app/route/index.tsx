import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { RouteStepCard } from '@/components/ui/RouteStepCard';
import { getBestRoute } from '@/features/routes/api/getBestRoute';
import { MOCK_BUILDINGS } from '@/lib/constants/mockData';
import { theme } from '@/lib/constants/theme';
import { scheduleRouteReminder } from '@/services/notifications/expoNotifications';

export default function RouteScreen() {
  const params = useLocalSearchParams<{
    originId?: string;
    destinationId?: string;
    accessible?: string;
  }>();

  const originId = params.originId ?? MOCK_BUILDINGS[0]?.id;
  const destinationId = params.destinationId ?? MOCK_BUILDINGS[1]?.id;
  const accessible = params.accessible === 'true';

  const { data, isPending, isError } = useQuery({
    queryKey: ['route', originId, destinationId, accessible],
    queryFn: () => getBestRoute(originId ?? '', destinationId ?? '', accessible),
    enabled: Boolean(originId && destinationId)
  });

  if (isPending) {
    return (
      <View style={styles.stateRoot}>
        <Text style={styles.stateText}>Calculating best route...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.stateRoot}>
        <Text style={styles.stateText}>Could not compute route right now.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Route</Text>
      <Text style={styles.stats}>
        {data.duration_min} min • {data.distance_m} m • {data.is_accessible ? 'Accessible' : 'Standard'}
      </Text>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={data.steps}
        keyExtractor={(item, index) => `${item.instruction}-${index}`}
        renderItem={({ item, index }) => <RouteStepCard index={index} step={item} />}
      />

      <Pressable
        onPress={() => router.push({ pathname: '/feedback', params: { building_id: destinationId } })}
        style={styles.feedbackButton}
      >
        <Text style={styles.feedbackButtonText}>Report Route Feedback</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          void scheduleRouteReminder({
            destinationName: 'your destination',
            minutesUntilLeave: 2
          });
        }}
        style={styles.reminderButton}
      >
        <Text style={styles.reminderButtonText}>Set 2-Min Route Reminder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.section
  },
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900'
  },
  stats: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 8
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.lg
  },
  feedbackButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    marginBottom: theme.spacing.section,
    paddingVertical: theme.spacing.md
  },
  feedbackButtonText: {
    color: theme.colors.primary,
    fontWeight: '800'
  },
  reminderButton: {
    alignItems: 'center',
    backgroundColor: '#d1fadf',
    borderRadius: theme.radii.pill,
    marginBottom: theme.spacing.section,
    marginTop: 10,
    paddingVertical: theme.spacing.md
  },
  reminderButtonText: {
    color: theme.colors.tertiary,
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
    color: theme.colors.primary
  }
});
