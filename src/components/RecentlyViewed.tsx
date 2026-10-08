import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { categoryStyle } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

/** "Browsing history" row: photo tiles with the price on top, like Alibaba. */
export function RecentlyViewed() {
  const { viewedIds, getListing } = useStore();
  const items = viewedIds.map((id) => getListing(id)).filter((l) => l !== undefined);
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <AppText weight="semiBold" size={18} style={styles.title}>
        Recently viewed
      </AppText>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(l) => l.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const style = categoryStyle[item.category];
          return (
            <Pressable onPress={() => router.push(`/listing/${item.id}`)} style={styles.tile} accessibilityRole="button" accessibilityLabel={item.title}>
              <View style={[styles.photo, { backgroundColor: style.tint }]}>
                {item.image ? (
                  <Image source={item.image} style={styles.image} contentFit="cover" cachePolicy="memory-disk" transition={0} />
                ) : (
                  <Ionicons name={style.icon} size={28} color={colors.navy} />
                )}
                <View style={styles.price}>
                  <AppText weight="bold" size={11} color={colors.white}>
                    {formatNLe(item.price)}
                  </AppText>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  title: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  tile: {
    width: 84,
  },
  photo: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  price: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(11,31,59,0.75)',
  },
});
