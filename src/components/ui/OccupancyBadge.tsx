import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/constants/theme';

type OccupancyBadgeProps = {
  percent: number;
};

function colorForOccupancy(percent: number) {
  if (percent >= 80) return '#b42318';
  if (percent >= 50) return '#b54708';
  return theme.colors.tertiary;
}

export function OccupancyBadge({ percent }: OccupancyBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: `${colorForOccupancy(percent)}22` }]}>
      <Text style={[styles.text, { color: colorForOccupancy(percent) }]}>{percent}% occupied</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs
  },
  text: {
    fontSize: 12,
    fontWeight: '700'
  }
});
