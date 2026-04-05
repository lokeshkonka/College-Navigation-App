import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { AdminGate } from '@/components/admin/AdminGate';
import { ClayCard } from '@/components/ui/ClayCard';
import { listAdminBuildings, updateAdminBuilding } from '@/features/admin/api/adminApi';
import { theme } from '@/lib/constants/theme';

export default function AdminBuildingsScreen() {
  const queryClient = useQueryClient();
  const { data = [], isPending, isError } = useQuery({
    queryKey: ['admin-buildings'],
    queryFn: listAdminBuildings
  });

  const mutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => updateAdminBuilding(id, { is_active }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-buildings'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      await queryClient.invalidateQueries({ queryKey: ['buildings'] });
    }
  });

  return (
    <AdminGate>
      <View style={styles.root}>
        <Text style={styles.title}>Building Management</Text>

        {isPending ? <Text style={styles.stateText}>Loading buildings...</Text> : null}
        {isError ? <Text style={styles.stateText}>Unable to load buildings.</Text> : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClayCard style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.code}</Text>
              <View style={styles.row}>
                <Text style={styles.toggleLabel}>{item.is_active ? 'Active' : 'Inactive'}</Text>
                <Switch
                  onValueChange={(next) => mutation.mutate({ id: item.id, is_active: next })}
                  value={item.is_active}
                />
              </View>
            </ClayCard>
          )}
        />

        <Pressable
          onPress={() => queryClient.invalidateQueries({ queryKey: ['admin-buildings'] })}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshText}>Refresh List</Text>
        </Pressable>
      </View>
    </AdminGate>
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
  stateText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md
  },
  listContent: {
    paddingBottom: theme.spacing.section,
    paddingTop: theme.spacing.lg
  },
  itemCard: {
    marginBottom: theme.spacing.md
  },
  itemTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '800'
  },
  itemMeta: {
    color: theme.colors.textMuted,
    marginTop: 4
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md
  },
  toggleLabel: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    marginBottom: theme.spacing.section,
    paddingVertical: theme.spacing.md
  },
  refreshText: {
    color: theme.colors.primary,
    fontWeight: '700'
  }
});
