import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import { ClayCard } from '@/components/ui/ClayCard';
import { FloatingHeader } from '@/components/ui/FloatingHeader';
import { getBuildings } from '@/features/buildings/api/getBuildings';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { theme } from '@/lib/constants/theme';

const QUICK_FILTERS = [
  { label: 'Library', icon: 'local-library' as const, tag: 'library' },
  { label: 'Dining', icon: 'restaurant' as const, tag: 'dining' },
  { label: 'Labs', icon: 'science' as const, tag: 'labs' },
  { label: 'Gym', icon: 'fitness-center' as const, tag: 'services' }
];

export default function SearchScreen() {
  const [term, setTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const debouncedTerm = useDebouncedValue(term, 350);

  const { data = [], isPending, isError } = useQuery({
    queryKey: ['buildings', debouncedTerm, selectedTag],
    queryFn: () => getBuildings(debouncedTerm, selectedTag),
    staleTime: 5 * 60_000
  });

  const handleTagPress = (tag: string) => {
    setSelectedTag(selectedTag === tag ? undefined : tag);
  };

  return (
    <View style={styles.root}>
      <FloatingHeader title="Tactile Cartographer" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Where to?</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color={theme.colors.outline} style={styles.searchIcon} />
          <TextInput
            value={term}
            onChangeText={setTerm}
            placeholder="Search buildings, labs, or rooms..."
            placeholderTextColor={theme.colors.outlineVariant}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {term.length > 0 && (
            <Pressable onPress={() => setTerm('')} style={styles.clearButton}>
              <MaterialIcons name="close" size={20} color={theme.colors.outline} />
            </Pressable>
          )}
        </View>

        {/* Quick Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          style={styles.chipsScroll}
        >
          {QUICK_FILTERS.map((filter) => (
            <Pressable
              key={filter.tag}
              onPress={() => handleTagPress(filter.tag)}
              style={({ pressed }) => [
                styles.filterChip,
                selectedTag === filter.tag && styles.filterChipActive,
                pressed && styles.filterChipPressed
              ]}
            >
              <MaterialIcons
                name={filter.icon}
                size={16}
                color={selectedTag === filter.tag ? theme.colors.onTertiaryContainer : theme.colors.primary}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedTag === filter.tag && styles.filterChipTextActive
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {!isPending && data.length > 0 && (
              <Text style={styles.resultsCount}>{data.length} found nearby</Text>
            )}
          </View>

          {isPending && (
            <Text style={styles.stateText}>Searching buildings...</Text>
          )}

          {isError && (
            <Text style={styles.stateText}>Failed to load results. Please try again.</Text>
          )}

          {!isPending && !isError && data.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={theme.colors.outlineVariant} />
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>Try adjusting your search or filters</Text>
            </View>
          )}

          {!isPending && !isError && data.length > 0 && (
            <View style={styles.resultsList}>
              {data.map((item) => (
                <ClayCard
                  key={item.id}
                  onPress={() => router.push({ pathname: '/building/[id]', params: { id: item.id } })}
                  style={styles.resultCard}
                >
                  <View style={styles.resultCardContent}>
                    <View style={styles.resultIcon}>
                      <MaterialIcons name="apartment" size={28} color={theme.colors.tertiary} />
                    </View>
                    <View style={styles.resultInfo}>
                      <View style={styles.resultHeader}>
                        <Text style={styles.resultTitle}>{item.name}</Text>
                        <Chip label={item.code} variant="secondary" size="small" />
                      </View>
                      <Text style={styles.resultMeta}>{item.tags.join(' • ')}</Text>
                      {item.distance && (
                        <View style={styles.resultFooter}>
                          <View style={styles.statusDot} />
                          <Text style={styles.resultDistance}>{item.distance}m away</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </ClayCard>
              ))}
            </View>
          )}
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
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
    letterSpacing: -0.5
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radii.full,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#2b3438',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0
  },
  searchIcon: {
    marginRight: theme.spacing.md
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: theme.colors.onSurface,
    padding: 0
  },
  clearButton: {
    padding: theme.spacing.xs
  },
  chipsScroll: {
    marginBottom: theme.spacing['3xl']
  },
  chipsContainer: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.screenPadding
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radii.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg
  },
  filterChipActive: {
    backgroundColor: theme.colors.tertiaryContainer,
    borderColor: theme.colors.tertiaryContainer
  },
  filterChipPressed: {
    opacity: 0.7
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  filterChipTextActive: {
    color: theme.colors.onTertiaryContainer
  },
  resultsSection: {
    flex: 1
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1.5
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.tertiary
  },
  stateText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: theme.spacing['4xl']
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['6xl']
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant
  },
  resultsList: {
    gap: theme.spacing.xl
  },
  resultCard: {
    padding: theme.spacing.cardPadding
  },
  resultCardContent: {
    flexDirection: 'row',
    gap: theme.spacing.lg
  },
  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultInfo: {
    flex: 1
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: theme.spacing.sm
  },
  resultMeta: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.md
  },
  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.tertiary
  },
  resultDistance: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8
  }
});
