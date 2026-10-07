import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { MemberRow } from '@/components/MemberRow';
import { Button, Chip, EmptyState } from '@/components/ui';
import { isNearby } from '@/data/locations';
import { trades } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function ServicesScreen() {
  const { allMembers, location } = useStore();
  const [trade, setTrade] = useState<string | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);

  const providers = useMemo(
    () =>
      allMembers
        .filter(
          (m) =>
            m.kind === 'provider' &&
            (!trade || m.trade === trade) &&
            (!nearbyOnly || isNearby(m.location, location)),
        )
        .sort((a, b) => Number(b.availability === 'Available Now') - Number(a.availability === 'Available Now')),
    [allMembers, trade, nearbyOnly, location],
  );

  return (
    <View style={styles.screen}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" selected={!trade} onPress={() => setTrade(null)} />
          {trades.map((t) => (
            <Chip key={t} label={t} selected={trade === t} onPress={() => setTrade(trade === t ? null : t)} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.filterRow}>
        <Chip
          label={`Near ${location}`}
          icon="location-outline"
          selected={nearbyOnly}
          onPress={() => setNearbyOnly((v) => !v)}
        />
      </View>
      <FlatList
        data={providers}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <MemberRow member={item} />}
        ListEmptyComponent={
          <EmptyState
            icon="construct-outline"
            title="No one found"
            body="Try another trade or turn off the location filter. You can also post a request in “I Need It Now”."
          />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <AppText size={13} color={colors.textMuted} style={styles.center}>
              Are you an electrician, plumber, tailor or mechanic?
            </AppText>
            <Button label="Offer your service" icon="add" variant="secondary" onPress={() => router.push('/offer-service')} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1,
  },
  footer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
});
