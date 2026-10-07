import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { ActionCard as ActionCardData } from '@/data/mock';
import { colors, radius, shadows } from '@/lib/theme';

type Props = {
  card: ActionCardData;
  size: 'large' | 'small';
};

export function ActionCard({ card, size }: Props) {
  const large = size === 'large';
  const iconSize = large ? 36 : 30;

  return (
    <Pressable
      onPress={() => router.push(card.href)}
      accessibilityRole="button"
      accessibilityLabel={`${card.title}. ${card.subtitle}`}
      style={({ pressed }) => [
        styles.card,
        large ? styles.large : styles.small,
        { backgroundColor: card.color, opacity: pressed ? 0.88 : 1 },
      ]}
    >
      {card.icon === 'percent-disc' ? (
        <View style={[styles.disc, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
          <AppText weight="bold" size={iconSize * 0.52} color={card.color}>
            %
          </AppText>
        </View>
      ) : (
        <Ionicons name={card.icon} size={iconSize} color={colors.white} />
      )}
      <AppText
        weight="semiBold"
        size={large ? 18 : 16}
        color={colors.white}
        numberOfLines={1}
        style={large ? styles.titleLarge : styles.titleSmall}
      >
        {card.title}
      </AppText>
      <AppText
        weight="medium"
        size={large ? 13 : 10}
        color="rgba(255,255,255,0.92)"
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {card.subtitle}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  large: {
    height: 122,
  },
  small: {
    height: 104,
  },
  titleLarge: {
    marginTop: 12,
  },
  titleSmall: {
    marginTop: 8,
  },
  disc: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
