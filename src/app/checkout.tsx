import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { LocationSheet } from '@/components/LocationSheet';
import { PaymentBadge } from '@/components/PaymentBadges';
import { Button, Chip, DemoNote, Field, SelectField } from '@/components/ui';
import { ALL_SIERRA_LEONE } from '@/data/locations';
import { cardBrand, formatCardNumber, formatExpiry, isValidCardNumber, isValidExpiry, isValidSlPhone } from '@/lib/card';
import { deliveryQuote } from '@/lib/delivery';
import { formatNLe } from '@/lib/format';
import { useStore, type PaymentMethod } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const METHODS: { key: PaymentMethod; title: string; subtitle: string }[] = [
  { key: 'orange', title: 'Orange Money', subtitle: 'Approve with your PIN on your phone' },
  { key: 'afrimoney', title: 'Afrimoney', subtitle: 'Approve with your PIN on your phone' },
  { key: 'card', title: 'Bank card', subtitle: 'Visa or Mastercard, local or international' },
  { key: 'cash', title: 'Cash on delivery', subtitle: 'Pay the rider or seller when you get the item' },
];

export default function CheckoutScreen() {
  const { only } = useLocalSearchParams<{ only?: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();

  const lines = store.cart
    .filter((c) => !only || c.listingId === only)
    .map((c) => ({ ...c, listing: store.getListing(c.listingId) }))
    .filter((l): l is typeof l & { listing: NonNullable<typeof l.listing> } => Boolean(l.listing));

  const defaultPlace = store.profile.location || (store.location === ALL_SIERRA_LEONE ? 'Freetown' : store.location);
  const [fulfilment, setFulfilment] = useState<'delivery' | 'pickup'>('delivery');
  const [place, setPlace] = useState(defaultPlace);
  const [street, setStreet] = useState('');
  const [phone, setPhone] = useState(store.profile.phone);
  const [method, setMethod] = useState<PaymentMethod>('orange');
  const [walletPhone, setWalletPhone] = useState(store.profile.phone);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [locationOpen, setLocationOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const subtotal = lines.reduce((sum, l) => sum + l.listing.price * l.qty, 0);
  // One delivery fee per seller, based on where they are.
  const deliveryFee = useMemo(() => {
    if (fulfilment === 'pickup') return 0;
    const sellers = new Map<string, string>();
    lines.forEach((l) => sellers.set(l.listing.sellerId, l.listing.location));
    return [...sellers.values()].reduce((sum, from) => sum + deliveryQuote(from, place).fee, 0);
  }, [lines, place, fulfilment]);
  const total = subtotal + deliveryFee;

  if (!lines.length) {
    return (
      <View style={styles.empty}>
        <AppText>Nothing to check out.</AppText>
        <Button label="Go to cart" onPress={() => router.replace('/cart')} />
      </View>
    );
  }

  const validate = (): string | null => {
    if (!isValidSlPhone(phone)) return 'Enter your phone number so the seller or rider can reach you.';
    if (fulfilment === 'delivery' && street.trim().length < 3) return 'Add your street or a landmark for delivery.';
    if ((method === 'orange' || method === 'afrimoney') && !isValidSlPhone(walletPhone))
      return `Enter the ${method === 'orange' ? 'Orange Money' : 'Afrimoney'} number to pay from.`;
    if (method === 'card') {
      if (!isValidCardNumber(card.number)) return 'Check the card number.';
      if (!isValidExpiry(card.expiry)) return 'Check the expiry date (MM/YY).';
      if (!/^\d{3,4}$/.test(card.cvc)) return 'Check the 3-digit security code on the back of the card.';
      if (card.name.trim().length < 2) return 'Enter the name on the card.';
    }
    return null;
  };

  const pay = () => {
    const problem = validate();
    if (problem) {
      Alert.alert('Check your details', problem);
      return;
    }
    const finish = () => {
      const last4 = card.number.replace(/\D/g, '').slice(-4);
      const orderId = store.placeOrder({
        items: lines.map((l) => ({
          listingId: l.listingId,
          title: l.listing.title,
          price: l.listing.price,
          qty: l.qty,
          sellerId: l.listing.sellerId,
        })),
        subtotal,
        deliveryFee,
        total,
        method,
        cardLabel: method === 'card' ? `${cardBrand(card.number)} •••• ${last4}` : undefined,
        payerPhone: method === 'orange' || method === 'afrimoney' ? walletPhone : undefined,
        fulfilment,
        address: fulfilment === 'delivery' ? `${street.trim()}, ${place}` : `Pickup from seller`,
        phone,
      });
      // Never keep card details in memory longer than needed.
      setCard({ number: '', expiry: '', cvc: '', name: '' });
      setProcessing(false);
      router.replace({ pathname: '/order/[id]', params: { id: orderId, placed: '1' } });
    };
    if (method === 'cash') {
      finish();
      return;
    }
    setProcessing(true);
    timer.current = setTimeout(finish, 2500);
  };

  const brand = cardBrand(card.number);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} keyboardShouldPersistTaps="handled">
        <Section title="Delivery">
          <View style={styles.chips}>
            <Chip label="Deliver to me" icon="bicycle-outline" selected={fulfilment === 'delivery'} onPress={() => setFulfilment('delivery')} />
            <Chip label="Pick up" icon="storefront-outline" selected={fulfilment === 'pickup'} onPress={() => setFulfilment('pickup')} />
          </View>
          {fulfilment === 'delivery' ? (
            <>
              <SelectField label="Town / area" value={place} onPress={() => setLocationOpen(true)} />
              <Field label="Street, house number or landmark" value={street} onChangeText={setStreet} placeholder="e.g. 12 Main Road, near the mosque" />
            </>
          ) : (
            <AppText size={13} color={colors.textMuted}>
              The seller will share the pickup address in chat after you order.
            </AppText>
          )}
          <Field label="Your phone number" value={phone} onChangeText={setPhone} placeholder="e.g. 076 123 456" keyboardType="phone-pad" />
        </Section>

        <Section title="Payment method">
          {METHODS.map((m) => {
            const selected = method === m.key;
            return (
              <View key={m.key}>
                <Pressable
                  onPress={() => setMethod(m.key)}
                  style={[styles.method, selected && styles.methodSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={selected ? colors.primary : colors.textMuted} />
                  <View style={styles.flex}>
                    <AppText weight="semiBold" size={14}>
                      {m.title}
                    </AppText>
                    <AppText size={12} color={colors.textMuted}>
                      {m.subtitle}
                    </AppText>
                  </View>
                  <View style={styles.badges}>
                    {m.key === 'card' ? (
                      <>
                        <PaymentBadge brand="visa" small />
                        <PaymentBadge brand="mastercard" small />
                      </>
                    ) : (
                      <PaymentBadge brand={m.key} small />
                    )}
                  </View>
                </Pressable>

                {selected && (m.key === 'orange' || m.key === 'afrimoney') ? (
                  <View style={styles.methodBody}>
                    <Field
                      label={`${m.title} number`}
                      value={walletPhone}
                      onChangeText={setWalletPhone}
                      placeholder="e.g. 076 123 456"
                      keyboardType="phone-pad"
                      hint="You’ll get a prompt on this phone to approve the payment with your PIN."
                    />
                  </View>
                ) : null}

                {selected && m.key === 'card' ? (
                  <View style={styles.methodBody}>
                    <Field
                      label={`Card number${brand !== 'Card' ? ` · ${brand}` : ''}`}
                      value={card.number}
                      onChangeText={(v) => setCard((c) => ({ ...c, number: formatCardNumber(v) }))}
                      placeholder="1234 5678 9012 3456"
                      keyboardType="number-pad"
                      autoComplete="cc-number"
                      textContentType="creditCardNumber"
                    />
                    <View style={styles.cardRow}>
                      <View style={styles.flex}>
                        <Field
                          label="Expiry"
                          value={card.expiry}
                          onChangeText={(v) => setCard((c) => ({ ...c, expiry: formatExpiry(v) }))}
                          placeholder="MM/YY"
                          keyboardType="number-pad"
                          autoComplete="cc-exp"
                        />
                      </View>
                      <View style={styles.flex}>
                        <Field
                          label="CVC"
                          value={card.cvc}
                          onChangeText={(v) => setCard((c) => ({ ...c, cvc: v.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="123"
                          keyboardType="number-pad"
                          secureTextEntry
                          autoComplete="cc-csc"
                        />
                      </View>
                    </View>
                    <Field
                      label="Name on card"
                      value={card.name}
                      onChangeText={(v) => setCard((c) => ({ ...c, name: v }))}
                      placeholder="e.g. FRANCIS BENDU"
                      autoCapitalize="characters"
                      autoComplete="cc-name"
                    />
                    <View style={styles.secure}>
                      <Ionicons name="lock-closed" size={14} color={colors.green} />
                      <AppText size={11} color={colors.textMuted} style={styles.flex}>
                        Encrypted. RAYNO never stores your full card number or CVC. Your bank may ask you to confirm with a code (3-D Secure).
                      </AppText>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
          <DemoNote>
            Demo: no real money moves yet. In the live app, mobile money and card payments go through a licensed payment
            partner, and the card form is theirs.
          </DemoNote>
        </Section>

        <Section title={`Order summary (${lines.length} ${lines.length === 1 ? 'item' : 'items'})`}>
          {lines.map((l) => (
            <SummaryRow key={l.listingId} label={`${l.qty} × ${l.listing.title}`} value={formatNLe(l.listing.price * l.qty)} />
          ))}
          <SummaryRow label="Delivery" value={fulfilment === 'pickup' ? 'Free (pickup)' : formatNLe(deliveryFee)} />
          <SummaryRow label="RAYNO Buyer Protection" value={method === 'cash' ? '—' : 'Free'} />
          <View style={styles.totalRow}>
            <AppText weight="semiBold" size={16}>
              Total
            </AppText>
            <AppText weight="bold" size={18} color={colors.red}>
              {formatNLe(total)}
            </AppText>
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: spacing.md + insets.bottom }]}>
        <Button
          label={method === 'cash' ? `Place order · ${formatNLe(total)}` : `Pay ${formatNLe(total)}`}
          icon={method === 'cash' ? 'checkmark' : 'lock-closed'}
          onPress={pay}
          style={styles.flex}
        />
      </View>

      <LocationSheet visible={locationOpen} selected={place} onSelect={setPlace} onClose={() => setLocationOpen(false)} />

      <Modal visible={processing} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText weight="semiBold" size={16} style={styles.center}>
              {method === 'card' ? 'Contacting your bank…' : 'Check your phone'}
            </AppText>
            <AppText size={13} color={colors.textMuted} style={styles.center}>
              {method === 'card'
                ? 'Confirm the payment if your bank sends you a code.'
                : `We sent a payment request of ${formatNLe(total)} to ${walletPhone}. Enter your ${
                    method === 'orange' ? 'Orange Money' : 'Afrimoney'
                  } PIN to approve.`}
            </AppText>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText weight="semiBold" size={16}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <AppText size={13} color={colors.textMuted} numberOfLines={1} style={styles.flex}>
        {label}
      </AppText>
      <AppText size={13}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F2F7FF',
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  methodBody: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secure: {
    flexDirection: 'row',
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    boxShadow: '0px -2px 12px rgba(11, 31, 59, 0.08)',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(11,31,59,0.45)',
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  center: {
    textAlign: 'center',
  },
});
