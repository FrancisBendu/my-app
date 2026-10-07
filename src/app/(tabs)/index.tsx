import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionCard } from '@/components/ActionCard';
import { AppText } from '@/components/AppText';
import { ListingSection } from '@/components/ListingSection';
import { LocationSheet } from '@/components/LocationSheet';
import { ALL_SIERRA_LEONE, isNearby } from '@/data/locations';
import { actionCards } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, radius, shadows, spacing } from '@/lib/theme';

const wordmark = require('../../../assets/rayno-wordmark.png');
// Intrinsic size of rayno-wordmark.png (865 x 190).
const WORDMARK_ASPECT = 865 / 190;

export default function HomeScreen() {
  const { location, setLocation, allListings } = useStore();
  const [locationOpen, setLocationOpen] = useState(false);

  const nearYou = useMemo(
    () => allListings.filter((l) => isNearby(l.location, location)).slice(0, 10),
    [allListings, location],
  );
  const trending = useMemo(() => allListings.filter((l) => l.trending), [allListings]);

  const [primary, secondary] = [actionCards.slice(0, 2), actionCards.slice(2)];
  const goToSearch = () => router.push('/search');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={wordmark}
            style={styles.wordmark}
            contentFit="contain"
            accessibilityLabel="RAYNO"
            accessibilityRole="header"
          />
          <Pressable
            onPress={() => router.push('/notifications')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={28} color={colors.navy} />
            <View style={styles.dot} />
          </Pressable>
        </View>
        <AppText weight="medium" size={14} style={styles.tagline}>
          Your everyday app for Sierra Leone.
        </AppText>

        <Pressable
          onPress={goToSearch}
          style={styles.search}
          accessibilityRole="search"
          accessibilityLabel="Search. What do you need today?"
        >
          <Ionicons name="search-outline" size={22} color={colors.textMuted} />
          <AppText size={16} color={colors.textMuted} style={styles.searchText}>
            What do you need today?
          </AppText>
          <Pressable
            onPress={() => router.push('/scan')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Scan a QR code or barcode"
          >
            <Ionicons name="scan-outline" size={22} color={colors.navy} />
          </Pressable>
        </Pressable>

        <Pressable
          onPress={() => setLocationOpen(true)}
          style={styles.location}
          accessibilityRole="button"
          accessibilityLabel={`Location: ${location}. Change location`}
        >
          <Ionicons name="location-sharp" size={20} color={colors.navy} />
          <AppText weight="medium" size={16}>
            {location}
          </AppText>
          <Ionicons name="chevron-down" size={14} color={colors.navy} />
        </Pressable>

        <View style={styles.cards}>
          <View style={styles.row}>
            {primary.map((card) => (
              <ActionCard key={card.key} card={card} size="large" />
            ))}
          </View>
          <View style={styles.row}>
            {secondary.map((card) => (
              <ActionCard key={card.key} card={card} size="small" />
            ))}
          </View>
        </View>

        {nearYou.length > 0 ? (
          <ListingSection
            title={location === ALL_SIERRA_LEONE ? 'Latest' : 'Near You'}
            items={nearYou}
            onSeeAll={() => router.push('/market')}
          />
        ) : (
          <View style={styles.emptyNear}>
            <AppText weight="semiBold" size={20}>
              Near You
            </AppText>
            <View style={styles.emptyCard}>
              <AppText size={14}>Nothing listed around {location} yet.</AppText>
              <AppText size={13} color={colors.textMuted}>
                Be the first: tap the blue + button to sell something, or choose another location.
              </AppText>
            </View>
          </View>
        )}
        <ListingSection
          title="Trending Today"
          items={trending}
          variant="compact"
          onSeeAll={() => router.push('/market')}
        />
      </ScrollView>

      <LocationSheet
        visible={locationOpen}
        selected={location}
        onSelect={setLocation}
        onClose={() => setLocationOpen(false)}
        allowAll
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  wordmark: {
    height: 42,
    width: 42 * WORDMARK_ASPECT,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  tagline: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: 18,
    paddingHorizontal: 18,
    height: 54,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#EDF0F3',
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  searchText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 20,
    paddingVertical: spacing.xs,
  },
  cards: {
    paddingHorizontal: spacing.lg,
    marginTop: 14,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  emptyNear: {
    marginTop: 20,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  emptyCard: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
    gap: 4,
  },
});
