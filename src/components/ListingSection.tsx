import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { ListingCard } from './ListingCard';
import type { Listing } from '@/data/mock';
import { colors, spacing } from '@/lib/theme';

type Props = {
  title: string;
  items: Listing[];
  onSeeAll?: () => void;
};

export function ListingSection({ title, items, onSeeAll }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText weight="semiBold" size={18}>
          {title}
        </AppText>
        {onSeeAll ? (
          <Pressable onPress={onSeeAll} hitSlop={8} accessibilityRole="button">
            <AppText weight="medium" size={13} color={colors.primary}>
              See All
            </AppText>
          </Pressable>
        ) : null}
      </View>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard item={item} />}
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
    marginTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
});
