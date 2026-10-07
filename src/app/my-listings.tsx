import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { ListingCard } from '@/components/ListingCard';
import { gridGap, useGridCardWidth } from '@/components/ListingGrid';
import { Button, EmptyState } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function MyListingsScreen() {
  const { myListings } = useStore();
  const cardWidth = useGridCardWidth();

  return (
    <FlatList
      style={styles.screen}
      data={myListings}
      keyExtractor={(l) => l.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <ListingCard item={item} width={cardWidth} />}
      ListHeaderComponent={
        myListings.length ? <Button label="Sell another item" icon="add" onPress={() => router.push('/sell')} /> : null
      }
      ListEmptyComponent={
        <EmptyState
          icon="cube-outline"
          title="You haven’t listed anything"
          body="Sell something in under a minute: add a photo, a price and your location."
          action={<Button label="Sell a product" icon="add" onPress={() => router.push('/sell')} />}
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
