import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { IconName } from '@/data/mock';
import { colors, radius, spacing } from '@/lib/theme';

type Props = {
  icon: IconName;
  color: string;
  title: string;
  description: string;
};

/** Simple "coming soon" body used by screens that aren't built yet. */
export function PlaceholderScreen({ icon, color, title, description }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <Ionicons name={icon} size={40} color={colors.white} />
      </View>
      <AppText weight="semiBold" size={20} style={styles.title}>
        {title}
      </AppText>
      <AppText size={14} color={colors.textMuted} style={styles.description}>
        {description}
      </AppText>
      <View style={styles.badge}>
        <AppText weight="medium" size={12} color={colors.primary}>
          Coming soon
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: radius.lg + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.lg,
  },
  description: {
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 21,
  },
  badge: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#E6F0FF',
  },
});
