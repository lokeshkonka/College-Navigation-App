import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { AdminGate } from '@/components/admin/AdminGate';
import { ClayCard } from '@/components/ui/ClayCard';
import { listAdminFeedback, moderateFeedback } from '@/features/admin/api/adminApi';
import { theme } from '@/lib/constants/theme';

export default function AdminFeedbackScreen() {
  const queryClient = useQueryClient();
  const { data = [], isPending, isError } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: listAdminFeedback
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'triaged' | 'resolved' | 'rejected' }) =>
      moderateFeedback(id, status, `Status changed to ${status}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
    }
  });

  return (
    <AdminGate>
      <View style={styles.root}>
        <Text style={styles.title}>Feedback Moderation</Text>

        {isPending ? <Text style={styles.stateText}>Loading feedback queue...</Text> : null}
        {isError ? <Text style={styles.stateText}>Unable to load feedback queue.</Text> : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClayCard style={styles.itemCard}>
              <Text style={styles.itemMeta}>
                {item.category} • {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <Text style={styles.itemBody}>{item.message}</Text>
              <Text style={styles.itemStatus}>Status: {item.status}</Text>

              <View style={styles.actionsRow}>
                <ActionButton
                  label="Triaged"
                  onPress={() => mutation.mutate({ id: item.id, status: 'triaged' })}
                  tone="neutral"
                />
                <ActionButton
                  label="Resolved"
                  onPress={() => mutation.mutate({ id: item.id, status: 'resolved' })}
                  tone="success"
                />
                <ActionButton
                  label="Reject"
                  onPress={() => mutation.mutate({ id: item.id, status: 'rejected' })}
                  tone="danger"
                />
              </View>
            </ClayCard>
          )}
        />
      </View>
    </AdminGate>
  );
}

function ActionButton({
  label,
  onPress,
  tone
}: {
  label: string;
  onPress: () => void;
  tone: 'neutral' | 'success' | 'danger';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.action,
        tone === 'success' ? styles.success : null,
        tone === 'danger' ? styles.danger : null
      ]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
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
  itemMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  itemBody: {
    color: theme.colors.primary,
    marginTop: 8
  },
  itemStatus: {
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 8,
    textTransform: 'capitalize'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.md
  },
  action: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    flex: 1,
    paddingVertical: 10
  },
  success: {
    backgroundColor: '#d1fadf'
  },
  danger: {
    backgroundColor: '#fee4e2'
  },
  actionText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800'
  }
});
