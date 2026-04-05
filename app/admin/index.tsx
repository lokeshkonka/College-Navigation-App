import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AdminGate } from '@/components/admin/AdminGate';
import { ClayCard } from '@/components/ui/ClayCard';
import { getAdminKpis } from '@/features/admin/api/adminApi';
import { theme } from '@/lib/constants/theme';

export default function AdminHomeScreen() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['admin-kpis'],
    queryFn: getAdminKpis
  });

  return (
    <AdminGate>
      <View style={styles.root}>
        <Text style={styles.title}>Admin Console</Text>
        <Text style={styles.subtitle}>Manage operations in the same app.</Text>

        {isPending ? <Text style={styles.stateText}>Loading KPIs...</Text> : null}
        {isError ? <Text style={styles.stateText}>Failed to load KPIs.</Text> : null}

        <View style={styles.kpiGrid}>
          <KpiCard label="Total Users" value={String(data?.totalUsers ?? '--')} />
          <KpiCard label="Open Feedback" value={String(data?.openFeedback ?? '--')} />
          <KpiCard label="Active Buildings" value={String(data?.activeBuildings ?? '--')} />
          <KpiCard label="Avg Occupancy" value={`${data?.avgOccupancy ?? '--'}%`} />
        </View>

        <Pressable onPress={() => router.push('/admin/buildings')} style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Building Management</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/admin/occupancy')} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Occupancy Control</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/admin/feedback')} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Feedback Moderation</Text>
        </Pressable>
        <Pressable onPress={() => refetch()} style={styles.buttonGhost}>
          <Text style={styles.buttonGhostText}>Refresh KPIs</Text>
        </Pressable>
      </View>
    </AdminGate>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <ClayCard style={styles.kpiCard}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </ClayCard>
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
  subtitle: {
    color: theme.colors.textMuted,
    marginTop: 6
  },
  stateText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md
  },
  kpiGrid: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  kpiCard: {
    marginBottom: 0
  },
  kpiLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  kpiValue: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 6
  },
  buttonPrimary: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.section,
    paddingVertical: theme.spacing.md
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  buttonSecondary: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  buttonSecondaryText: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  buttonGhost: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingVertical: 8
  },
  buttonGhostText: {
    color: theme.colors.tertiary,
    fontWeight: '700'
  }
});
