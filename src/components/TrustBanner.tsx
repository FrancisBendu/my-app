import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/lib/theme';

/** Two-part promise banner (like Alibaba's "Free shipping | Order protection"). */
export function TrustBanner() {
  return (
    <Pressable onPress={() => router.push('/help')} style={styles.banner} accessibilityRole="button">
      <View style={styles.half}>
        <Ionicons name="shield-checkmark" size={22} color={colors.green} />
        <View style={styles.flex}>
          <AppText weight="semiBold" size={13}>
            Buyer Protection
          </AppText>
          <AppText size={11} color={colors.textMuted}>
            From payment to delivery
          </AppText>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.half}>
        <Ionicons name="wallet" size={22} color={colors.orange} />
        <View style={styles.flex}>
          <AppText weight="semiBold" size={13}>
            Pay your way
          </AppText>
          <AppText size={11} color={colors.textMuted}>
            Mobile money, card or cash
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#EEF5FF',
  },
  half: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: spacing.sm,
    backgroundColor: '#CFE0FF',
  },
  flex: {
    flex: 1,
  },
});
