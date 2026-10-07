import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ListingCard } from '@/components/ListingCard';
import { gridGap, useGridCardWidth } from '@/components/ListingGrid';
import { LocationSheet } from '@/components/LocationSheet';
import { Button, Chip, EmptyState } from '@/components/ui';
import { isNearby } from '@/data/locations';
import { categories, type Category } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

const SORTS = ['Newest', 'Lowest price', 'Highest price'] as const;
type Sort = (typeof SORTS)[number];

export default function MarketScreen() {
  const params = useLocalSearchParams<{ category?: Category }>();
  const { allListings, location, setLocation } = useStore();
  const [category, setCategory] = useState<Category | null>(params.category ?? null);
  const [sort, setSort] = useState<Sort>('Newest');
  const [locationOpen, setLocationOpen] = useState(false);
  const cardWidth = useGridCardWidth();

  const items = useMemo(() => {
    const filtered = allListings.filter(
      (l) => l.category !== 'services' && (!category || l.category === category) && isNearby(l.location, location),
    );
    const sorted = [...filtered];
    if (sort === 'Newest') sorted.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    if (sort === 'Lowest price') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'Highest price') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [allListings, category, location, sort]);

  const nextSort = () => setSort(SORTS[(SORTS.indexOf(sort) + 1) % SORTS.length]);

  return (
    <View style={styles.screen}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" selected={!category} onPress={() => setCategory(null)} />
          {categories
            .filter((c) => c.key !== 'services')
            .map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                icon={c.icon}
                selected={category === c.key}
                onPress={() => setCategory(category === c.key ? null : c.key)}
              />
            ))}
        </ScrollView>
      </View>
      <View style={styles.toolbar}>
        <Pressable onPress={() => setLocationOpen(true)} style={styles.tool} accessibilityRole="button">
          <Ionicons name="location-sharp" size={16} color={colors.navy} />
          <AppText weight="medium" size={13} numberOfLines={1} style={styles.shrink}>
            {location}
          </AppText>
          <Ionicons name="chevron-down" size={12} color={colors.navy} />
        </Pressable>
        <Pressable onPress={nextSort} style={styles.tool} accessibilityRole="button" accessibilityLabel={`Sort: ${sort}`}>
          <Ionicons name="swap-vertical" size={16} color={colors.navy} />
          <AppText weight="medium" size={13}>
            {sort}
          </AppText>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ListingCard item={item} width={cardWidth} />}
        initialNumToRender={6}
        ListHeaderComponent={
          <AppText size={13} color={colors.textMuted}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </AppText>
        }
        ListEmptyComponent={
          <EmptyState
            icon="bag-handle-outline"
            title="Nothing here yet"
            body={`No items in ${location} for this category. Try “All of Sierra Leone” or sell something yourself.`}
            action={<Button label="Sell a product" icon="add" onPress={() => router.push('/sell')} />}
          />
        }
      />

      <LocationSheet
        visible={locationOpen}
        selected={location}
        onSelect={setLocation}
        onClose={() => setLocationOpen(false)}
        allowAll
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  tool: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  shrink: {
    flexShrink: 1,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: gridGap,
    flexGrow: 1,
  },
  column: {
    gap: gridGap,
  },
});
