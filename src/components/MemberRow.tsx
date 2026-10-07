import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { Avatar, Rating, VerifiedBadge } from './ui';
import type { Member } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { colors, radius, spacing } from '@/lib/theme';

/** A service provider or store in a list. Tapping opens their profile. */
export function MemberRow({ member, extra }: { member: Member; extra?: string }) {
  const availabilityColor = member.availability === 'Busy' ? colors.red : colors.green;
  return (
    <Pressable
      onPress={() => router.push(`/member/${member.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Avatar name={member.name} size={54} color={member.kind === 'store' ? colors.primary : colors.navy} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <AppText weight="semiBold" size={15} numberOfLines={1} style={styles.shrink}>
            {member.name}
          </AppText>
          {member.verified ? <VerifiedBadge size={14} /> : null}
        </View>
        <AppText size={12} color={colors.textMuted}>
          {member.trade ?? member.storeCategory}
          {member.priceFrom ? ` · from ${formatNLe(member.priceFrom)}` : ''}
        </AppText>
        <Rating rating={member.rating} reviews={member.reviews} />
        <AppText size={12} color={colors.textMuted} numberOfLines={1}>
          {member.location}
          {member.availability ? (
            <AppText size={12} color={availabilityColor}>
              {' · '}
              {member.availability}
            </AppText>
          ) : null}
          {extra ? ` · ${extra}` : ''}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    boxShadow: '0px 2px 8px rgba(11, 31, 59, 0.08)',
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shrink: {
    flexShrink: 1,
  },
});
