import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { Listing } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { colors, radius } from '@/lib/theme';

const CARD_WIDTH = 132;

export function ListingCard({ item }: { item: Listing }) {
  const [saved, setSaved] = useState(false);

  return (
    <Pressable
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${formatNLe(item.price, item.priceSuffix)}, ${item.location}`}
    >
      <View style={[styles.media, { backgroundColor: item.tint }]}>
        {item.image ? (
          <Image
            source={item.image}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={0}
          />
        ) : (
          <Ionicons name={item.icon} size={44} color={colors.navy} style={styles.icon} />
        )}
        <Pressable
          onPress={() => setSaved((s) => !s)}
          hitSlop={8}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={16}
            color={saved ? colors.red : colors.textMuted}
          />
        </Pressable>
      </View>
      <AppText weight="medium" size={13} numberOfLines={1} style={styles.title}>
        {item.title}
      </AppText>
      <AppText weight="semiBold" size={14}>
        {formatNLe(item.price, item.priceSuffix)}
      </AppText>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={12} color={colors.textMuted} />
        <AppText size={11} color={colors.textMuted}>
          {item.location}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
  },
  media: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.85,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    opacity: 0.8,
  },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
});
