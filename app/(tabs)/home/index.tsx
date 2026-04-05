import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ClayCard } from '@/components/ui/ClayCard';
import { ClaySunkenInput } from '@/components/ui/ClaySunkenInput';
import { getRecentDestinations } from '@/features/navigation/api/getRecentDestinations';
import { theme } from '@/lib/constants/theme';

export default function HomeScreen() {
  const { data = [], isPending, isError } = useQuery({
    queryKey: ['recent-destinations'],
    queryFn: getRecentDestinations
  });

  return (
    <View style={styles.root}>
      <Text style={styles.pageTitle}>Campus Home</Text>
      <Pressable onPress={() => router.push('/search')}>
        <ClaySunkenInput editable={false} placeholder="Where to, explorer?" />
      </Pressable>

      <ClayCard style={styles.currentCard}>
        <Text style={styles.metaLabel}>Current Location</Text>
        <Text style={styles.locationTitle}>Main Library Atrium</Text>
        <Text style={styles.locationSubtitle}>Open now, medium occupancy</Text>
      </ClayCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.metaLabel}>Recent Destinations</Text>
      </View>

      {isPending ? <Text style={styles.stateText}>Loading recent destinations...</Text> : null}
      {isError ? <Text style={styles.stateText}>Could not load live history, showing fallback data.</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/building/[id]', params: { id: item.building_id } })}>
            <ClayCard style={styles.recentCard}>
              <Text style={styles.recentTitle}>{item.building_name}</Text>
              <Text style={styles.recentMeta}>{item.relative_time}</Text>
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
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.section
  },
  pageTitle: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: theme.spacing.lg
  },
  currentCard: {
    marginTop: theme.spacing.lg
  },
  metaLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase'
  },
  locationTitle: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6
  },
  locationSubtitle: {
    color: theme.colors.textMuted,
    marginTop: 4
  },
  sectionHeader: {
    marginTop: theme.spacing.section
  },
  stateText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: theme.spacing.md
  },
  recentCard: {
    marginBottom: theme.spacing.md
  },
  recentTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700'
  },
  recentMeta: {
    color: theme.colors.textMuted,
    marginTop: 4
  }
});
