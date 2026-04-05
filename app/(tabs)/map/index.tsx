import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingGlassHeader } from '@/components/ui/FloatingGlassHeader';
import { getMapPoints } from '@/features/map/api/getMapPoints';
import { theme } from '@/lib/constants/theme';

export default function MapScreen() {
  const { data = [] } = useQuery({
    queryKey: ['map-points'],
    queryFn: getMapPoints,
    staleTime: 5 * 60_000
  });

  return (
    <View style={styles.root}>
      <FloatingGlassHeader title="Campus Map" />
      <View style={styles.mapCanvas}>
        <Text style={styles.canvasText}>Live map canvas placeholder</Text>
        <Text style={styles.canvasSubtext}>Markers below are linked to building details.</Text>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/building/[id]', params: { id: item.id } })}>
            <ClayCard style={styles.markerCard}>
              <Text style={styles.markerTitle}>{item.name}</Text>
              <Text style={styles.markerCoords}>
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            </ClayCard>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  mapCanvas: {
    alignItems: 'center',
    backgroundColor: '#d9e3ea',
    borderRadius: 32,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.section
  },
  canvasText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '800'
  },
  canvasSubtext: {
    color: theme.colors.textMuted,
    marginTop: 8,
    textAlign: 'center'
  },
  listContent: {
    padding: theme.spacing.lg
  },
  markerCard: {
    marginBottom: theme.spacing.md
  },
  markerTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700'
  },
  markerCoords: {
    color: theme.colors.textMuted,
    marginTop: 4
  }
});
