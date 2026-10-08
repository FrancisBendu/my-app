import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { CartButton } from '@/components/CartButton';
import { ListingCard } from '@/components/ListingCard';
import { ListingGrid } from '@/components/ListingGrid';
import { PaymentBadges } from '@/components/PaymentBadges';
import { Avatar, Button, EmptyState, Rating, VerifiedBadge } from '@/components/ui';
import { ALL_SIERRA_LEONE } from '@/data/locations';
import { categories, categoryStyle, reviews } from '@/data/mock';
import { deliveryQuote } from '@/lib/delivery';
import { formatNLe, timeAgo } from '@/lib/format';
import { ME, useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const NOT_SHIPPABLE = ['services', 'property'];

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const { getListing, getMember, savedIds, toggleSaved, openConversation, removeListing, addViewed, addToCart, allListings } =
    store;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [photoIndex, setPhotoIndex] = useState(0);
  const listing = getListing(id);

  useEffect(() => {
    if (listing) addViewed(listing.id);
  }, [listing, addViewed]);

  const related = useMemo(
    () =>
      listing
        ? {
            fromSeller: allListings.filter((l) => l.sellerId === listing.sellerId && l.id !== listing.id).slice(0, 8),
            similar: allListings
              .filter((l) => l.category === listing.category && l.id !== listing.id && l.sellerId !== listing.sellerId)
              .slice(0, 6),
          }
        : { fromSeller: [], similar: [] },
    [allListings, listing],
  );

  if (!listing) {
    return <EmptyState icon="alert-circle-outline" title="Listing not found" body="It may have been removed." />;
  }

  const seller = getMember(listing.sellerId);
  const mine = listing.sellerId === ME;
  const shippable = !NOT_SHIPPABLE.includes(listing.category) && !mine;
  const saved = savedIds.includes(listing.id);
  const photos = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const fallback = categoryStyle[listing.category];
  const categoryLabel = categories.find((c) => c.key === listing.category)?.label;
  const price = formatNLe(listing.price, listing.priceSuffix);
  const discount = listing.oldPrice ? Math.round((1 - listing.price / listing.oldPrice) * 100) : 0;
  const deliverTo = store.profile.location || (store.location === ALL_SIERRA_LEONE ? 'Freetown' : store.location);
  const quote = deliveryQuote(listing.location, deliverTo);
  const itemReviews = reviews.filter((r) => r.listingId === listing.id);
  const shownReviews = (itemReviews.length ? itemReviews : reviews.filter((r) => r.sellerId === listing.sellerId)).slice(0, 3);

  const attributes: [string, string][] = [
    ...(listing.condition ? [['Condition', listing.condition] as [string, string]] : []),
    ...(categoryLabel ? [['Category', categoryLabel] as [string, string]] : []),
    ...Object.entries(listing.specs ?? {}),
  ];

  const chat = () => {
    if (!seller) return;
    router.push(`/chat/${openConversation(seller.id, listing.id)}`);
  };

  const call = () =>
    Alert.alert(
      'Calling is coming soon',
      'Phone calls will work once sellers sign up with verified numbers. For now, send them a chat message.',
    );

  const share = () => Share.share({ message: `${listing.title} – ${price} in ${listing.location}. Found on RAYNO.` });

  const addCart = () => {
    addToCart(listing.id);
    Alert.alert('Added to cart', listing.title, [
      { text: 'Keep shopping', style: 'cancel' },
      { text: 'View cart', onPress: () => router.push('/cart') },
    ]);
  };

  const buyNow = () => {
    if (!store.cart.some((c) => c.listingId === listing.id)) addToCart(listing.id);
    router.push({ pathname: '/checkout', params: { only: listing.id } });
  };

  const remove = () =>
    Alert.alert('Delete listing?', 'This removes it from RAYNO.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeListing(listing.id);
          router.back();
        },
      },
    ]);

  const onPhotoScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: '',
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={share} hitSlop={8} accessibilityLabel="Share">
                <Ionicons name="share-outline" size={22} color={colors.navy} />
              </Pressable>
              <Pressable onPress={() => toggleSaved(listing.id)} hitSlop={8} accessibilityLabel={saved ? 'Unsave' : 'Save'}>
                <Ionicons name={saved ? 'heart' : 'heart-outline'} size={22} color={saved ? colors.red : colors.navy} />
              </Pressable>
              <CartButton size={22} />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}>
        {photos.length ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onPhotoScroll}
              onScroll={onPhotoScroll}
              scrollEventThrottle={64}
            >
              {photos.map((photo, i) => (
                <Image
                  key={i}
                  source={photo}
                  style={{ width, height: width }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={0}
                />
              ))}
            </ScrollView>
            {photos.length > 1 ? (
              <View style={styles.counter}>
                <AppText weight="medium" size={12} color={colors.white}>
                  {photoIndex + 1}/{photos.length}
                </AppText>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[styles.placeholder, { height: width * 0.6, backgroundColor: fallback.tint }]}>
            <Ionicons name={fallback.icon} size={72} color={colors.navy} />
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.priceRow}>
            <AppText weight="bold" size={26} color={colors.red}>
              {price}
            </AppText>
            {listing.oldPrice ? (
              <>
                <AppText size={14} color={colors.textMuted} style={styles.strike}>
                  {formatNLe(listing.oldPrice)}
                </AppText>
                <View style={styles.discount}>
                  <AppText weight="bold" size={11} color={colors.white}>
                    -{discount}%
                  </AppText>
                </View>
              </>
            ) : null}
          </View>
          <AppText weight="semiBold" size={18} style={styles.title}>
            {listing.title}
          </AppText>
          <AppText size={13} color={colors.textMuted} style={styles.meta}>
            {listing.sold ? `${listing.sold} sold · ` : ''}
            {listing.location} · {timeAgo(listing.postedAt)}
          </AppText>
        </View>

        {shippable ? (
          <View style={[styles.section, styles.protection]}>
            <View style={styles.rowCenter}>
              <Ionicons name="shield-checkmark" size={20} color={colors.green} />
              <AppText weight="semiBold" size={15}>
                RAYNO Buyer Protection
              </AppText>
            </View>
            <AppText size={12} color={colors.textMuted} style={styles.protectionText}>
              Pay through RAYNO and the seller only gets the money after you confirm you received the item.
            </AppText>
            <View style={styles.protectionRow}>
              <ProtectionPoint icon="lock-closed-outline" label="Secure payments" />
              <ProtectionPoint icon="return-down-back-outline" label="Refund if not as described" />
            </View>
            <AppText size={12} color={colors.textMuted} style={styles.payWith}>
              Pay with
            </AppText>
            <PaymentBadges />
          </View>
        ) : null}

        {attributes.length ? (
          <View style={styles.section}>
            <AppText weight="semiBold" size={16}>
              Key attributes
            </AppText>
            <View style={styles.attributes}>
              {attributes.map(([label, value]) => (
                <View key={label} style={styles.attribute}>
                  <AppText weight="medium" size={14}>
                    {value}
                  </AppText>
                  <AppText size={12} color={colors.textMuted}>
                    {label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {shippable ? (
          <View style={styles.section}>
            <AppText weight="semiBold" size={16}>
              Delivery to {deliverTo}
            </AppText>
            <View style={styles.deliveryRow}>
              <DeliveryOption title={quote.days} subtitle={`${quote.label} · ${formatNLe(quote.fee)}`} icon="bicycle-outline" />
              <DeliveryOption title="Pickup" subtitle={`From the seller in ${listing.location} · Free`} icon="storefront-outline" />
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <AppText weight="semiBold" size={16}>
            Description
          </AppText>
          <AppText size={14} style={styles.description}>
            {listing.description || 'No description.'}
          </AppText>
        </View>

        {seller ? (
          <Pressable onPress={() => router.push(`/member/${seller.id}`)} style={[styles.section, styles.sellerCard]} accessibilityRole="button">
            <Avatar name={seller.name} size={48} color={seller.kind === 'store' ? colors.primary : colors.navy} />
            <View style={styles.flex}>
              <View style={styles.rowCenter}>
                <AppText weight="semiBold" size={15} numberOfLines={1} style={styles.shrink}>
                  {mine ? 'You' : seller.name}
                </AppText>
                {seller.verified ? <VerifiedBadge /> : null}
              </View>
              <Rating rating={seller.rating} reviews={seller.reviews} />
              <AppText size={12} color={colors.textMuted}>
                {new Date().getFullYear() - seller.since || 1} yr on RAYNO · {seller.location}
              </AppText>
            </View>
            <AppText weight="medium" size={13} color={colors.primary}>
              Visit store
            </AppText>
          </Pressable>
        ) : null}

        {shownReviews.length ? (
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <AppText weight="semiBold" size={16}>
                {itemReviews.length ? 'Product reviews' : 'Store reviews'}
              </AppText>
              {seller ? <Rating rating={seller.rating} reviews={seller.reviews} /> : null}
            </View>
            {shownReviews.map((r) => (
              <View key={r.id} style={styles.review}>
                <View style={styles.rowBetween}>
                  <AppText weight="medium" size={13}>
                    {r.author}
                  </AppText>
                  <AppText size={11} color={colors.textMuted}>
                    {timeAgo(r.at)}
                  </AppText>
                </View>
                <AppText size={12} color="#FFB800">
                  {'★'.repeat(r.rating)}
                  <AppText size={12} color={colors.border}>
                    {'★'.repeat(5 - r.rating)}
                  </AppText>
                </AppText>
                <AppText size={13} style={styles.reviewText}>
                  {r.text}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        {related.fromSeller.length ? (
          <View style={styles.sectionNoPad}>
            <AppText weight="semiBold" size={16} style={styles.padded}>
              More from this {seller?.kind === 'store' ? 'store' : 'seller'}
            </AppText>
            <FlatList
              horizontal
              data={related.fromSeller}
              keyExtractor={(l) => l.id}
              renderItem={({ item }) => <ListingCard item={item} variant="compact" />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hList}
            />
          </View>
        ) : null}

        {related.similar.length ? (
          <View style={styles.section}>
            <AppText weight="semiBold" size={16} style={styles.gridTitle}>
              You may also like
            </AppText>
            <ListingGrid items={related.similar} />
          </View>
        ) : null}

        <View style={[styles.section, styles.safety]}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.orange} />
          <AppText size={12} style={styles.flex}>
            Stay safe: never send money outside RAYNO to someone you don’t know. If paying cash, meet in a public
            place and check the item first.
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: spacing.md + insets.bottom }]}>
        {mine ? (
          <Button label="Delete listing" icon="trash-outline" variant="danger" onPress={remove} style={styles.flex} />
        ) : (
          <>
            {seller ? (
              <BarIcon icon="storefront-outline" label="Store" onPress={() => router.push(`/member/${seller.id}`)} />
            ) : null}
            <BarIcon icon="chatbubble-ellipses-outline" label="Chat" onPress={chat} />
            {shippable ? (
              <>
                <Button label="Add to cart" variant="secondary" onPress={addCart} style={styles.flex} />
                <Button label="Buy now" onPress={buyNow} style={styles.flex} />
              </>
            ) : (
              <>
                <Button label="Call" icon="call-outline" variant="secondary" onPress={call} style={styles.flex} />
                <Button label="Chat now" onPress={chat} style={styles.flex} />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

function ProtectionPoint({ icon, label }: { icon: 'lock-closed-outline' | 'return-down-back-outline'; label: string }) {
  return (
    <View style={styles.protectionPoint}>
      <Ionicons name={icon} size={20} color={colors.green} />
      <AppText size={12}>{label}</AppText>
    </View>
  );
}

function DeliveryOption({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: 'bicycle-outline' | 'storefront-outline';
}) {
  return (
    <View style={styles.deliveryOption}>
      <Ionicons name={icon} size={18} color={colors.navy} />
      <AppText weight="semiBold" size={14}>
        {title}
      </AppText>
      <AppText size={11} color={colors.textMuted}>
        {subtitle}
      </AppText>
    </View>
  );
}

function BarIcon({
  icon,
  label,
  onPress,
}: {
  icon: 'storefront-outline' | 'chatbubble-ellipses-outline';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.barIcon} accessibilityRole="button" accessibilityLabel={label}>
      <Ionicons name={icon} size={22} color={colors.navy} />
      <AppText size={10}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionNoPad: {
    backgroundColor: colors.white,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  hList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  gridTitle: {
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  discount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  title: {
    marginTop: 4,
  },
  meta: {
    marginTop: 4,
  },
  protection: {
    gap: 4,
  },
  protectionText: {
    lineHeight: 17,
  },
  protectionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  protectionPoint: {
    flex: 1,
    gap: 4,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#E8F9EF',
  },
  payWith: {
    marginTop: spacing.sm,
  },
  attributes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  attribute: {
    width: '50%',
    padding: spacing.sm,
  },
  deliveryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  deliveryOption: {
    flex: 1,
    gap: 2,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  description: {
    marginTop: 6,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shrink: {
    flexShrink: 1,
  },
  review: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 2,
  },
  reviewText: {
    lineHeight: 19,
  },
  safety: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
    boxShadow: '0px -2px 12px rgba(11, 31, 59, 0.08)',
  },
  barIcon: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  flex: {
    flex: 1,
  },
});
