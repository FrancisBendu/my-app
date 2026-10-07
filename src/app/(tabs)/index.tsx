import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionCard } from '@/components/ActionCard';
import { AppText } from '@/components/AppText';
import { ListingSection } from '@/components/ListingSection';
import { LocationSheet } from '@/components/LocationSheet';
import { Logo } from '@/components/Logo';
import {
  actionCards,
  DEFAULT_LOCATION,
  nearYou,
  notificationCount,
  trendingToday,
} from '@/data/mock';
import { colors, radius, spacing } from '@/lib/theme';

export default function HomeScreen() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationOpen, setLocationOpen] = useState(false);

  const [primary, secondary] = [actionCards.slice(0, 2), actionCards.slice(2)];
  const goToSearch = () => router.push('/search');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Logo size={30} />
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Notifications, ${notificationCount} new`}
          >
            <Ionicons name="notifications-outline" size={26} color={colors.navy} />
            {notificationCount > 0 ? <View style={styles.dot} /> : null}
          </Pressable>
        </View>
        <AppText size={14} style={styles.tagline}>
          Your everyday app for Sierra Leone.
        </AppText>

        <Pressable
          onPress={goToSearch}
          style={styles.search}
          accessibilityRole="search"
          accessibilityLabel="Search. What do you need today?"
        >
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <AppText size={15} color={colors.textMuted} style={styles.searchText}>
            What do you need today?
          </AppText>
          <Ionicons name="scan-outline" size={20} color={colors.navy} />
        </Pressable>

        <Pressable
          onPress={() => setLocationOpen(true)}
          style={styles.location}
          accessibilityRole="button"
          accessibilityLabel={`Location: ${location}. Change location`}
        >
          <Ionicons name="location" size={18} color={colors.navy} />
          <AppText weight="medium" size={15}>
            {location}
          </AppText>
          <Ionicons name="chevron-down" size={16} color={colors.navy} />
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

        <ListingSection title="Near You" items={nearYou} onSeeAll={() => router.push('/market')} />
        <ListingSection
          title="Trending Today"
          items={trendingToday}
          onSeeAll={() => router.push('/market')}
        />
      </ScrollView>

      <LocationSheet
        visible={locationOpen}
        selected={location}
        onSelect={setLocation}
        onClose={() => setLocationOpen(false)}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl + spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  dot: {
    position: 'absolute',
    top: 1,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  tagline: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  searchText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  cards: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
