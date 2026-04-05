import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { ClayCard } from '@/components/ui/ClayCard';
import { ClaySunkenInput } from '@/components/ui/ClaySunkenInput';
import { getBuildings } from '@/features/buildings/api/getBuildings';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { theme } from '@/lib/constants/theme';

const TAGS = ['library', 'dining', 'labs', 'services'];

export default function SearchScreen() {
  const [term, setTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const debouncedTerm = useDebouncedValue(term, 350);

  const { data = [], isPending, isError } = useQuery({
    queryKey: ['buildings', debouncedTerm, selectedTag],
    queryFn: () => getBuildings(debouncedTerm, selectedTag),
    staleTime: 5 * 60_000
  });

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Search Campus</Text>
      <ClaySunkenInput onChangeText={setTerm} placeholder="Search by building or code" value={term} />

      <View style={styles.tagsRow}>
        {TAGS.map((tag) => {
          const selected = selectedTag === tag;
          return (
            <Pressable
              key={tag}
              onPress={() => setSelectedTag(selected ? undefined : tag)}
              style={[styles.tagChip, selected && styles.tagChipSelected]}
            >
              <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
            </Pressable>
          );
        })}
      </View>

      {isPending ? <Text style={styles.stateText}>Searching buildings...</Text> : null}
      {isError ? <Text style={styles.stateText}>Failed live query. Showing fallback entries.</Text> : null}

      {!isPending && data.length === 0 ? <Text style={styles.stateText}>No buildings matched your query.</Text> : null}

      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/building/[id]', params: { id: item.id } })}>
            <ClayCard style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemCode}>{item.code}</Text>
              <Text style={styles.itemMeta}>{item.tags.join(' • ')}</Text>
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
  title: {
    color: theme.colors.primary,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: theme.spacing.lg
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: theme.spacing.md
  },
  tagChip: {
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8
  },
  tagChipSelected: {
    backgroundColor: theme.colors.tertiary
  },
  tagText: {
    color: theme.colors.primary,
    fontWeight: '700'
  },
  tagTextSelected: {
    color: '#ffffff'
  },
  stateText: {
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: theme.spacing.md
  },
  itemCard: {
    marginBottom: theme.spacing.md
  },
  itemTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '800'
  },
  itemCode: {
    color: theme.colors.textMuted,
    marginTop: 2
  },
  itemMeta: {
    color: theme.colors.textMuted,
    marginTop: 6
  }
});
