import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, EmptyState } from '@/components/ui';
import { formatNLe, timeAgo } from '@/lib/format';
import { METHOD_LABEL, STATUS_COLOR } from '@/lib/orders';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

export default function OrderScreen() {
  const { id, placed } = useLocalSearchParams<{ id: string; placed?: string }>();
  const { orders, setOrderStatus, getMember, openConversation } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) return <EmptyState icon="receipt-outline" title="Order not found" body="Check My Orders in your profile." />;

  const protectedPayment = order.method !== 'cash';
  const open = order.status === 'Paid · protected' || order.status === 'Pay on delivery';
  const sellerIds = [...new Set(order.items.map((i) => i.sellerId))];

  const confirm = () =>
    Alert.alert(
      'Did you receive everything?',
      protectedPayment ? 'Confirming releases the payment to the seller.' : 'This marks the order as complete.',
      [
        { text: 'Not yet', style: 'cancel' },
        { text: 'Yes, received', onPress: () => setOrderStatus(order.id, 'Received') },
      ],
    );

  const report = () =>
    Alert.alert('Report a problem?', 'RAYNO support will hold the payment and contact you and the seller.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Report', style: 'destructive', onPress: () => setOrderStatus(order.id, 'Problem reported') },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: placed ? 'Order placed' : 'Order details' }} />
      {placed ? (
        <View style={styles.success}>
          <Ionicons name="checkmark-circle" size={56} color={colors.green} />
          <AppText weight="semiBold" size={20}>
            Thank you!
          </AppText>
          <AppText size={13} color={colors.textMuted} style={styles.center}>
            {protectedPayment
              ? 'Your payment is held safely by RAYNO. The seller gets it after you confirm you received your order.'
              : 'Pay the rider or seller in cash when you receive your order.'}
          </AppText>
        </View>
      ) : null}

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <AppText weight="semiBold" size={15}>
            Order {order.id}
          </AppText>
          <View style={[styles.status, { backgroundColor: STATUS_COLOR[order.status] }]}>
            <AppText weight="semiBold" size={11} color={colors.white}>
              {order.status}
            </AppText>
          </View>
        </View>
        <AppText size={12} color={colors.textMuted}>
          Placed {timeAgo(order.createdAt)}
        </AppText>
        {order.items.map((item) => (
          <View key={item.listingId} style={styles.rowBetween}>
            <AppText size={13} numberOfLines={1} style={styles.flex}>
              {item.qty} × {item.title}
            </AppText>
            <AppText size={13}>{formatNLe(item.price * item.qty)}</AppText>
          </View>
        ))}
        <View style={styles.rowBetween}>
          <AppText size={13} color={colors.textMuted}>
            Delivery
          </AppText>
          <AppText size={13}>{order.deliveryFee ? formatNLe(order.deliveryFee) : 'Free'}</AppText>
        </View>
        <View style={[styles.rowBetween, styles.total]}>
          <AppText weight="semiBold">Total</AppText>
          <AppText weight="bold" size={17} color={colors.red}>
            {formatNLe(order.total)}
          </AppText>
        </View>
      </View>

      <View style={styles.card}>
        <Info icon="card-outline" label="Payment" value={order.cardLabel ?? METHOD_LABEL[order.method]} />
        {order.payerPhone ? <Info icon="phone-portrait-outline" label="Paid from" value={order.payerPhone} /> : null}
        <Info icon={order.fulfilment === 'delivery' ? 'bicycle-outline' : 'storefront-outline'} label={order.fulfilment === 'delivery' ? 'Deliver to' : 'Pickup'} value={order.address} />
        <Info icon="call-outline" label="Contact" value={order.phone} />
      </View>

      {sellerIds.map((sid) => {
        const seller = getMember(sid);
        if (!seller) return null;
        return (
          <Button
            key={sid}
            label={`Chat with ${seller.name}`}
            icon="chatbubble-ellipses-outline"
            variant="secondary"
            onPress={() => router.push(`/chat/${openConversation(sid, order.items.find((i) => i.sellerId === sid)?.listingId)}`)}
          />
        );
      })}

      {open ? (
        <>
          <Button label="I received my order" icon="checkmark-done" onPress={confirm} />
          <Button label="Report a problem" icon="alert-circle-outline" variant="danger" onPress={report} />
        </>
      ) : null}

      <Button label="View all orders" variant="secondary" onPress={() => router.replace('/orders')} />
    </ScrollView>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: 'card-outline' | 'phone-portrait-outline' | 'bicycle-outline' | 'storefront-outline' | 'call-outline';
  label: string;
  value: string;
}) {
  return (
    <View style={styles.info}>
      <Ionicons name={icon} size={18} color={colors.textMuted} />
      <AppText size={13} color={colors.textMuted} style={styles.infoLabel}>
        {label}
      </AppText>
      <AppText size={13} style={styles.flex}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  success: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  center: {
    textAlign: 'center',
    lineHeight: 19,
  },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  total: {
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  info: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 80,
  },
  flex: {
    flex: 1,
  },
});
