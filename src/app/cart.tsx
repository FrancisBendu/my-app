import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button, EmptyState } from '@/components/ui';
import { categoryStyle } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

export default function CartScreen() {
  const { cart, getListing, getMember, setCartQty } = useStore();
  const insets = useSafeAreaInsets();
  const lines = cart
    .map((c) => ({ ...c, listing: getListing(c.listingId) }))
    .filter((l): l is typeof l & { listing: NonNullable<typeof l.listing> } => Boolean(l.listing));
  const subtotal = lines.reduce((sum, l) => sum + l.listing.price * l.qty, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  if (!lines.length) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          body="Tap “Add to cart” on any item. You can pay with Orange Money, Afrimoney, card or cash."
          action={<Button label="Browse the Market" onPress={() => router.replace('/market')} />}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={lines}
        keyExtractor={(l) => l.listingId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const style = categoryStyle[item.listing.category];
          const seller = getMember(item.listing.sellerId);
          return (
            <View style={styles.row}>
              <Pressable onPress={() => router.push(`/listing/${item.listingId}`)} style={[styles.thumb, { backgroundColor: style.tint }]}>
                {item.listing.image ? (
                  <Image source={item.listing.image} style={styles.thumbImage} contentFit="cover" />
                ) : (
                  <Ionicons name={style.icon} size={28} color={colors.navy} />
                )}
              </Pressable>
              <View style={styles.body}>
                <AppText weight="medium" size={14} numberOfLines={2}>
                  {item.listing.title}
                </AppText>
                {seller ? (
                  <AppText size={12} color={colors.textMuted} numberOfLines={1}>
                    {seller.name}
                  </AppText>
                ) : null}
                <View style={styles.bottomRow}>
                  <AppText weight="bold" size={15} color={colors.red}>
                    {formatNLe(item.listing.price)}
                  </AppText>
                  <View style={styles.stepper}>
                    <Pressable
                      onPress={() => setCartQty(item.listingId, item.qty - 1)}
                      hitSlop={6}
                      style={styles.stepButton}
                      accessibilityLabel={item.qty === 1 ? 'Remove' : 'Decrease quantity'}
                    >
                      <Ionicons name={item.qty === 1 ? 'trash-outline' : 'remove'} size={16} color={colors.navy} />
                    </Pressable>
                    <AppText weight="semiBold" size={14} style={styles.qty}>
                      {item.qty}
                    </AppText>
                    <Pressable
                      onPress={() => setCartQty(item.listingId, item.qty + 1)}
                      hitSlop={6}
                      style={styles.stepButton}
                      accessibilityLabel="Increase quantity"
                    >
                      <Ionicons name="add" size={16} color={colors.navy} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
      <View style={[styles.footer, { paddingBottom: spacing.md + insets.bottom }]}>
        <View style={styles.flex}>
          <AppText size={12} color={colors.textMuted}>
            Subtotal ({count} {count === 1 ? 'item' : 'items'})
          </AppText>
          <AppText weight="bold" size={18}>
            {formatNLe(subtotal)}
          </AppText>
        </View>
        <Button label="Checkout" icon="lock-closed" onPress={() => router.push('/checkout')} style={styles.checkout} />
      </View>
    </View>
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
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  bottomRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.lightGrey,
  },
  stepButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    minWidth: 22,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    boxShadow: '0px -2px 12px rgba(11, 31, 59, 0.08)',
  },
  flex: {
    flex: 1,
  },
  checkout: {
    paddingHorizontal: spacing.xl,
  },
});
