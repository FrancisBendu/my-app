import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius } from '@/lib/theme';

/** Brand colours for each way to pay. Text badges keep the app light (no logo images). */
export const PAYMENT_BRANDS = {
  orange: { label: 'Orange Money', bg: '#FF7900', fg: '#FFFFFF' },
  afrimoney: { label: 'Afrimoney', bg: '#6A1B9A', fg: '#FFFFFF' },
  visa: { label: 'VISA', bg: '#1A1F71', fg: '#FFFFFF' },
  mastercard: { label: 'Mastercard', bg: '#EB001B', fg: '#FFFFFF' },
  cash: { label: 'Cash', bg: colors.lightGrey, fg: colors.navy },
} as const;

export function PaymentBadge({ brand, small }: { brand: keyof typeof PAYMENT_BRANDS; small?: boolean }) {
  const b = PAYMENT_BRANDS[brand];
  return (
    <View style={[styles.badge, { backgroundColor: b.bg }, small && styles.small]}>
      <AppText weight="bold" size={small ? 9 : 10} color={b.fg}>
        {b.label}
      </AppText>
    </View>
  );
}

export function PaymentBadges() {
  return (
    <View style={styles.row}>
      {(Object.keys(PAYMENT_BRANDS) as (keyof typeof PAYMENT_BRANDS)[]).map((k) => (
        <PaymentBadge key={k} brand={k} small />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm - 3,
  },
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
