import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { AdminGate } from '@/components/admin/AdminGate';
import { ClayCard } from '@/components/ui/ClayCard';
import { listAdminOccupancy, upsertAdminOccupancy } from '@/features/admin/api/adminApi';
import { theme } from '@/lib/constants/theme';

export default function AdminOccupancyScreen() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const { data = [], isPending, isError } = useQuery({
    queryKey: ['admin-occupancy'],
    queryFn: listAdminOccupancy,
    staleTime: 20_000
  });

  const mutation = useMutation({
    mutationFn: ({ buildingId, occupancy }: { buildingId: string; occupancy: number }) =>
      upsertAdminOccupancy(buildingId, occupancy),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-occupancy'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      await queryClient.invalidateQueries({ queryKey: ['building'] });
    }
  });

  return (
    <AdminGate>
      <View style={styles.root}>
        <Text style={styles.title}>Occupancy Control</Text>

        {isPending ? <Text style={styles.stateText}>Loading occupancy...</Text> : null}
        {isError ? <Text style={styles.stateText}>Unable to load occupancy data.</Text> : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={(item) => item.building_id}
          renderItem={({ item }) => {
            const value = drafts[item.building_id] ?? String(item.occupancy_percent);
            return (
              <ClayCard style={styles.itemCard}>
                <Text style={styles.itemTitle}>{item.building_name}</Text>
                <Text style={styles.itemMeta}>Last update: {new Date(item.updated_at).toLocaleString()}</Text>
                <View style={styles.editorRow}>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={(next) => setDrafts((prev) => ({ ...prev, [item.building_id]: next }))}
                    style={styles.input}
                    value={value}
                  />
                  <Pressable
                    onPress={() => {
                      const numeric = Number(value);
                      if (Number.isFinite(numeric) && numeric >= 0 && numeric <= 100) {
                        mutation.mutate({ buildingId: item.building_id, occupancy: Math.round(numeric) });
                      }
                    }}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                </View>
              </ClayCard>
            );
          }}
        />
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
  editorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.md
  },
  input: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    color: theme.colors.primary,
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 10
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '800'
  }
});
