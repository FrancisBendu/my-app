import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { categoryStyle, type Listing } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, shadows } from '@/lib/theme';

export type ListingCardVariant = 'featured' | 'compact';

const SIZES = {
  featured: { width: 124, imageHeight: 98 },
  compact: { width: 96, imageHeight: 84 },
} as const;

type Props = {
  item: Listing;
  variant?: ListingCardVariant;
  /** Overrides the variant width, e.g. for two-column grids. */
  width?: number;
};

export function ListingCard({ item, variant = 'featured', width: widthOverride }: Props) {
  const { savedIds, toggleSaved } = useStore();
  const saved = savedIds.includes(item.id);
  const size = SIZES[variant];
  const width = widthOverride ?? size.width;
  const imageHeight = widthOverride ? widthOverride * 0.8 : size.imageHeight;
  const fallback = categoryStyle[item.category];
  const featured = variant === 'featured';
  const price = formatNLe(item.price, item.priceSuffix);

  return (
    <Pressable
      onPress={() => router.push(`/listing/${item.id}`)}
      style={({ pressed }) => [
        styles.card,
        featured && styles.featuredCard,
        { width, opacity: pressed ? 0.85 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${price}, ${item.location}`}
    >
      <View style={[styles.media, { height: imageHeight, backgroundColor: fallback.tint }]}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={0}
            recyclingKey={item.id}
          />
        ) : (
          <Ionicons name={fallback.icon} size={40} color={colors.navy} />
        )}
        <Pressable
          onPress={() => toggleSaved(item.id)}
          hitSlop={10}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={14}
            color={saved ? colors.red : colors.primary}
          />
        </Pressable>
      </View>
      <View style={featured ? styles.featuredBody : styles.compactBody}>
        <AppText weight="medium" size={featured ? 13 : 11} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText weight="semiBold" size={featured ? 14 : 13} style={styles.price}>
          {price}
        </AppText>
        {item.oldPrice ? (
          <AppText size={11} color={colors.textMuted} style={styles.oldPrice}>
            {formatNLe(item.oldPrice)}
          </AppText>
        ) : null}
        {item.sold && widthOverride ? (
          <AppText size={11} color={colors.textMuted}>
            {item.sold} sold
          </AppText>
        ) : null}
        {featured ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color={colors.textMuted} />
            <AppText size={12} color={colors.textMuted} numberOfLines={1} style={styles.flex}>
              {item.location}
            </AppText>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  featuredCard: {
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  media: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 8,
  },
  compactBody: {
    paddingTop: 8,
  },
  price: {
    marginTop: 1,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  flex: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
});
