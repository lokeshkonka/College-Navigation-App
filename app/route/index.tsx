import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
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
      <View style={styles.root}>
        <FloatingHeader title="Route" showBack />
        <View style={styles.stateContainer}>
          <MaterialIcons name="directions" size={48} color={theme.colors.outlineVariant} />
          <Text style={styles.stateText}>Calculating best route...</Text>
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.root}>
        <FloatingHeader title="Route" showBack />
        <View style={styles.stateContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
          <Text style={styles.stateText}>Could not compute route right now.</Text>
          <Button
            onPress={() => router.back()}
            variant="secondary"
            size="medium"
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FloatingHeader title="Route" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Route Summary Card */}
        <ClayCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Route Overview</Text>
            <Chip
              label={data.is_accessible ? 'Accessible' : 'Standard'}
              variant={data.is_accessible ? 'tertiary' : 'secondary'}
              size="small"
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialIcons name="schedule" size={24} color={theme.colors.tertiary} />
              <Text style={styles.statValue}>{data.duration_min}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons name="straighten" size={24} color={theme.colors.tertiary} />
              <Text style={styles.statValue}>{data.distance_m}</Text>
              <Text style={styles.statLabel}>meters</Text>
            </View>
          </View>
        </ClayCard>

        {/* Route Steps */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>Turn-by-Turn Directions</Text>
          <View style={styles.stepsList}>
            {data.steps.map((step, index) => (
              <RouteStepCard key={`${step.instruction}-${index}`} index={index} step={step} />
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            onPress={() => {
              void scheduleRouteReminder({
                destinationName: 'your destination',
                minutesUntilLeave: 2
              });
            }}
            variant="tertiary"
            size="large"
            icon="notifications"
            iconPosition="left"
            fullWidth
            style={styles.actionButton}
          >
            Set Route Reminder
          </Button>

          <Button
            onPress={() => router.push({ pathname: '/feedback', params: { building_id: destinationId } })}
            variant="secondary"
            size="medium"
            icon="feedback"
            iconPosition="left"
            fullWidth
          >
            Report Route Feedback
          </Button>
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
    paddingHorizontal: theme.spacing.screenPadding,
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
    marginTop: theme.spacing.xl,
    textAlign: 'center'
  },
  backButton: {
    marginTop: theme.spacing.xl
  },
  summaryCard: {
    marginBottom: theme.spacing['4xl']
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.3
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  stepsSection: {
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
  stepsList: {
    gap: theme.spacing.md
  },
  actionsSection: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['4xl']
  },
  actionButton: {
    marginBottom: theme.spacing.sm
  }
});
