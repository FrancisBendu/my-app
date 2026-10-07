import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, Button, EmptyState, Rating, VerifiedBadge } from '@/components/ui';
import { categories, categoryStyle } from '@/data/mock';
import { formatNLe, timeAgo } from '@/lib/format';
import { ME, useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getListing, getMember, savedIds, toggleSaved, openConversation, removeListing } = useStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listing = getListing(id);

  if (!listing) {
    return <EmptyState icon="alert-circle-outline" title="Listing not found" body="It may have been removed." />;
  }

  const seller = getMember(listing.sellerId);
  const mine = listing.sellerId === ME;
  const saved = savedIds.includes(listing.id);
  const photos = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const fallback = categoryStyle[listing.category];
  const categoryLabel = categories.find((c) => c.key === listing.category)?.label;
  const price = formatNLe(listing.price, listing.priceSuffix);

  const chat = () => {
    if (!seller) return;
    const conversationId = openConversation(seller.id, listing.id);
    router.push(`/chat/${conversationId}`);
  };

  const call = () =>
    Alert.alert(
      'Calling is coming soon',
      'Phone calls will work once sellers sign up with verified numbers. For now, send them a chat message.',
    );

  const share = () =>
    Share.share({ message: `${listing.title} – ${price} in ${listing.location}. Found on RAYNO.` });

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
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
        {photos.length ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {photos.map((photo, i) => (
              <Image
                key={i}
                source={photo}
                style={{ width, height: width * 0.8 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={0}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.placeholder, { height: width * 0.6, backgroundColor: fallback.tint }]}>
            <Ionicons name={fallback.icon} size={72} color={colors.navy} />
          </View>
        )}

        <View style={styles.body}>
          <AppText weight="semiBold" size={22}>
            {listing.title}
          </AppText>
          <View style={styles.priceRow}>
            <AppText weight="bold" size={22} color={colors.primary}>
              {price}
            </AppText>
            {listing.oldPrice ? (
              <AppText size={15} color={colors.textMuted} style={styles.strike}>
                {formatNLe(listing.oldPrice)}
              </AppText>
            ) : null}
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-sharp" size={14} color={colors.textMuted} />
            <AppText size={13} color={colors.textMuted}>
              {listing.location} · {timeAgo(listing.postedAt)}
            </AppText>
          </View>
          <View style={styles.tags}>
            {categoryLabel ? <Tag label={categoryLabel} /> : null}
            {listing.condition ? <Tag label={listing.condition} /> : null}
          </View>

          <AppText weight="semiBold" size={16} style={styles.heading}>
            Description
          </AppText>
          <AppText size={14} style={styles.description}>
            {listing.description || 'No description.'}
          </AppText>

          {seller ? (
            <Pressable
              onPress={() => router.push(`/member/${seller.id}`)}
              style={styles.sellerCard}
              accessibilityRole="button"
            >
              <Avatar name={seller.name} size={48} />
              <View style={styles.flex}>
                <View style={styles.nameRow}>
                  <AppText weight="semiBold" size={15} numberOfLines={1}>
                    {mine ? 'You' : seller.name}
                  </AppText>
                  {seller.verified ? <VerifiedBadge /> : null}
                </View>
                <Rating rating={seller.rating} reviews={seller.reviews} />
                <AppText size={12} color={colors.textMuted}>
                  {seller.location} · On RAYNO since {seller.since}
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}

          <View style={styles.safety}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.green} />
            <AppText size={12} style={styles.flex}>
              Stay safe: meet in a public place, check the item before you pay, and never send money in
              advance to someone you don’t know.
            </AppText>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: spacing.md + insets.bottom }]}>
        {mine ? (
          <Button label="Delete listing" icon="trash-outline" variant="danger" onPress={remove} style={styles.flex} />
        ) : (
          <>
            <Button label="Call" icon="call-outline" variant="secondary" onPress={call} style={styles.flex} />
            <Button label="Chat" icon="chatbubble-ellipses-outline" onPress={chat} style={styles.flex2} />
          </>
        )}
      </View>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <AppText weight="medium" size={12}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginTop: 4,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGrey,
  },
  heading: {
    marginTop: spacing.xl,
  },
  description: {
    marginTop: 6,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  safety: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#E8F9EF',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    boxShadow: '0px -2px 12px rgba(11, 31, 59, 0.08)',
  },
  flex: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
});
