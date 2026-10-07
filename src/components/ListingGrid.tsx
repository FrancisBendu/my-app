import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { ListingCard } from './ListingCard';
import type { Listing } from '@/data/mock';
import { spacing } from '@/lib/theme';

const GAP = spacing.md;

/** Two-column grid card width for the current screen. */
export function useGridCardWidth() {
  const { width } = useWindowDimensions();
  return Math.floor((width - spacing.lg * 2 - GAP) / 2);
}

/** Two-column grid for short lists inside a ScrollView. Use FlatList numColumns for long ones. */
export function ListingGrid({ items }: { items: Listing[] }) {
  const cardWidth = useGridCardWidth();
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <ListingCard key={item.id} item={item} width={cardWidth} />
      ))}
    </View>
  );
}

export const gridGap = GAP;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
});
