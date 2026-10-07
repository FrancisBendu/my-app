import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { Listing } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { colors, shadows } from '@/lib/theme';

export type ListingCardVariant = 'featured' | 'compact';

const SIZES = {
  featured: { width: 124, imageHeight: 98 },
  compact: { width: 96, imageHeight: 84 },
} as const;

type Props = {
  item: Listing;
  variant?: ListingCardVariant;
};

export function ListingCard({ item, variant = 'featured' }: Props) {
  const [saved, setSaved] = useState(item.saved ?? false);
  const { width, imageHeight } = SIZES[variant];
  const featured = variant === 'featured';
  const price = formatNLe(item.price, item.priceSuffix);

  return (
    <Pressable
      style={[styles.card, featured && styles.featuredCard, { width }]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${price}, ${item.location}`}
    >
      <View style={[styles.media, { height: imageHeight, backgroundColor: item.tint }]}>
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
          <Ionicons name={item.icon} size={40} color={colors.navy} />
        )}
        <Pressable
          onPress={() => setSaved((s) => !s)}
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
        {featured ? (
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color={colors.textMuted} />
            <AppText size={12} color={colors.textMuted}>
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
});
