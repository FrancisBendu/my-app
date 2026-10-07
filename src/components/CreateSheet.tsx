import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { BottomSheet } from './BottomSheet';
import type { IconName } from '@/data/mock';
import { colors, radius, spacing } from '@/lib/theme';

type Option = {
  key: string;
  title: string;
  subtitle: string;
  icon: IconName;
  color: string;
  href: Href;
};

const OPTIONS: Option[] = [
  {
    key: 'sell',
    title: 'Sell a Product',
    subtitle: 'List an item on the Market',
    icon: 'bag-add-outline',
    color: colors.green,
    href: '/sell',
  },
  {
    key: 'service',
    title: 'Offer a Service',
    subtitle: 'Get hired by people near you',
    icon: 'construct-outline',
    color: colors.orange,
    href: '/offer-service',
  },
  {
    key: 'need',
    title: 'Post What I Need',
    subtitle: 'Get quick offers from sellers',
    icon: 'flash',
    color: colors.primary,
    href: '/need-it-now',
  },
];

export function CreateSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const choose = (href: Href) => {
    onClose();
    router.push(href);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="What would you like to do?">
      {OPTIONS.map((option) => (
        <Pressable
          key={option.key}
          onPress={() => choose(option.href)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={[styles.iconWrap, { backgroundColor: option.color }]}>
            <Ionicons name={option.icon} size={22} color={colors.white} />
          </View>
          <View style={styles.text}>
            <AppText weight="semiBold" size={15}>
              {option.title}
            </AppText>
            <AppText size={12} color={colors.textMuted}>
              {option.subtitle}
            </AppText>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
      ))}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
  },
});
