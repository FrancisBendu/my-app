import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { AppText } from './AppText';
import type { ActionCard as ActionCardData } from '@/data/mock';
import { colors, radius } from '@/lib/theme';

type Props = {
  card: ActionCardData;
  size: 'large' | 'small';
  style?: ViewStyle;
};

export function ActionCard({ card, size, style }: Props) {
  const large = size === 'large';
  return (
    <Pressable
      onPress={() => router.push(card.href)}
      accessibilityRole="button"
      accessibilityLabel={`${card.title}. ${card.subtitle}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: card.color, minHeight: large ? 116 : 100, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <Ionicons name={card.icon} size={large ? 34 : 28} color={colors.white} />
      <AppText weight="semiBold" size={large ? 17 : 15} color={colors.white} style={styles.title}>
        {card.title}
      </AppText>
      <AppText
        size={large ? 13 : 10}
        color="rgba(255,255,255,0.85)"
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
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
  },
});
