import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ListingCard } from '@/components/ListingCard';
import { gridGap, useGridCardWidth } from '@/components/ListingGrid';
import { EmptyState } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const discount = (price: number, oldPrice: number) => Math.round((1 - price / oldPrice) * 100);

export default function DealsScreen() {
  const { allListings } = useStore();
  const cardWidth = useGridCardWidth();

  const deals = useMemo(
    () =>
      allListings
        .filter((l) => l.oldPrice && l.oldPrice > l.price)
        .sort((a, b) => discount(b.price, b.oldPrice!) - discount(a.price, a.oldPrice!)),
    [allListings],
  );

  return (
    <FlatList
      style={styles.screen}
      data={deals}
      keyExtractor={(l) => l.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <AppText size={13} color={colors.textMuted}>
          Price drops from sellers across Sierra Leone, biggest discount first.
        </AppText>
      }
      ListEmptyComponent={<EmptyState icon="pricetag-outline" title="No deals right now" body="Check back later." />}
      renderItem={({ item }) => (
        <View>
          <ListingCard item={item} width={cardWidth} />
          <View style={styles.badge}>
            <AppText weight="bold" size={12} color={colors.white}>
              -{discount(item.price, item.oldPrice!)}%
            </AppText>
          </View>
        </View>
      )}
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
  },
  column: {
    gap: gridGap,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.red,
  },
});
