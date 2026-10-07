import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { ListingCard, type ListingCardVariant } from './ListingCard';
import type { Listing } from '@/data/mock';
import { colors, spacing } from '@/lib/theme';

type Props = {
  title: string;
  items: Listing[];
  variant?: ListingCardVariant;
  onSeeAll?: () => void;
};

export function ListingSection({ title, items, variant = 'featured', onSeeAll }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText weight="semiBold" size={20}>
          {title}
        </AppText>
        {onSeeAll ? (
          <Pressable onPress={onSeeAll} hitSlop={8} accessibilityRole="button">
            <AppText weight="medium" size={14} color={colors.primary}>
              See All
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} variant={variant} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        initialNumToRender={4}
        windowSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    // Room for card shadows, which a horizontal list would otherwise clip.
    paddingVertical: spacing.sm,
    gap: 10,
  },
});
