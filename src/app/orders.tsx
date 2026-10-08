import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, EmptyState } from '@/components/ui';
import { formatNLe, timeAgo } from '@/lib/format';
import { METHOD_LABEL, STATUS_COLOR } from '@/lib/orders';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

export default function OrdersScreen() {
  const { orders } = useStore();
  return (
    <FlatList
      style={styles.screen}
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          body="When you buy something, you can follow it here and confirm when it arrives."
          action={<Button label="Browse the Market" onPress={() => router.push('/market')} />}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/order/${item.id}`)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <View style={styles.top}>
            <AppText weight="semiBold" size={14}>
              {item.id}
            </AppText>
            <View style={[styles.status, { backgroundColor: STATUS_COLOR[item.status] }]}>
              <AppText weight="semiBold" size={11} color={colors.white}>
                {item.status}
              </AppText>
            </View>
          </View>
          <AppText size={13} numberOfLines={1}>
            {item.items.map((i) => i.title).join(', ')}
          </AppText>
          <AppText size={12} color={colors.textMuted}>
            {formatNLe(item.total)} · {item.cardLabel ?? METHOD_LABEL[item.method]} · {timeAgo(item.createdAt)}
          </AppText>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1,
  },
  row: {
    gap: 4,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
});
