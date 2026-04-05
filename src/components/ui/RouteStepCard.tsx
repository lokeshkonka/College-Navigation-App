import { StyleSheet, Text } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { theme } from '@/lib/constants/theme';
import type { RouteStep } from '@/types/domain';

type RouteStepCardProps = {
  index: number;
  step: RouteStep;
};

export function RouteStepCard({ index, step }: RouteStepCardProps) {
  return (
    <ClayCard style={styles.card}>
      <Text style={styles.stepLabel}>Step {index + 1}</Text>
      <Text style={styles.instruction}>{step.instruction}</Text>
      <Text style={styles.distance}>{step.distance_m} m</Text>
    </ClayCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md
  },
  stepLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  instruction: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6
  },
  distance: {
    color: theme.colors.textMuted,
    marginTop: 6
  }
});
