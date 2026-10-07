import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ListingCard } from '@/components/ListingCard';
import { gridGap, useGridCardWidth } from '@/components/ListingGrid';
import { Button, EmptyState } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function SavedScreen() {
  const { savedIds, getListing } = useStore();
  const cardWidth = useGridCardWidth();
  const items = useMemo(
    () => savedIds.map((id) => getListing(id)).filter((l) => l !== undefined),
    [savedIds, getListing],
  );

  return (
    <FlatList
      style={styles.screen}
      data={items}
      keyExtractor={(l) => l.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <ListingCard item={item} width={cardWidth} />}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="Nothing saved yet"
          body="Tap the heart on any item to keep it here."
          action={<Button label="Browse the Market" onPress={() => router.push('/market')} />}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    padding: spacing.lg,
    gap: gridGap,
    flexGrow: 1,
  },
  column: {
    gap: gridGap,
  },
});
