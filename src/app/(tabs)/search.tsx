import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, Chip, EmptyState, VerifiedBadge } from '@/components/ui';
import { categories, categoryStyle, type Category, type Listing, type Member } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { ME, useStore } from '@/lib/store';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type Result = { type: 'listing'; item: Listing } | { type: 'member'; item: Member };

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const { allListings, allMembers } = useStore();
  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState<Category | null>(null);

  // A scan (or another screen) can send a search term via ?q=
  const [lastParam, setLastParam] = useState(params.q);
  if (params.q !== lastParam) {
    setLastParam(params.q);
    if (params.q !== undefined) setQuery(params.q);
  }

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const match = (...fields: (string | undefined)[]) =>
      !q || fields.some((f) => f?.toLowerCase().includes(q));

    const listingHits = allListings
      .filter((l) => (!category || l.category === category) && match(l.title, l.description, l.location))
      .map((item) => ({ type: 'listing' as const, item }));

    const memberHits =
      q && (!category || category === 'services')
        ? allMembers
            .filter((m) => m.id !== ME && match(m.name, m.trade, m.storeCategory, m.location))
            .map((item) => ({ type: 'member' as const, item }))
        : [];

    return [...memberHits, ...listingHits];
  }, [query, category, allListings, allMembers]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppText weight="semiBold" size={22} style={styles.heading}>
        Search
      </AppText>
      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Items, stores, electricians..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <Pressable onPress={() => router.push('/scan')} hitSlop={10} accessibilityLabel="Scan a code">
          <Ionicons name="scan-outline" size={20} color={colors.navy} />
        </Pressable>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" selected={!category} onPress={() => setCategory(null)} />
          {categories.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              icon={c.icon}
              selected={category === c.key}
              onPress={() => setCategory(category === c.key ? null : c.key)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(r) => `${r.type}-${r.item.id}`}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title={`No results for “${query}”`}
            body="Try another word, or post it in “I Need It Now” so sellers can send you offers."
          />
        }
        renderItem={({ item: r }) =>
          r.type === 'listing' ? <ListingRow item={r.item} /> : <MemberRow item={r.item} />
        }
      />
    </SafeAreaView>
  );
}

function ListingRow({ item }: { item: Listing }) {
  const style = categoryStyle[item.category];
  return (
    <Pressable
      onPress={() => router.push(`/listing/${item.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={[styles.thumb, { backgroundColor: style.tint }]}>
        {item.image ? (
          <Image source={item.image} style={styles.thumbImage} contentFit="cover" />
        ) : (
          <Ionicons name={style.icon} size={22} color={colors.navy} />
        )}
      </View>
      <View style={styles.rowText}>
        <AppText weight="medium" size={14} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText size={12} color={colors.textMuted} numberOfLines={1}>
          {item.location}
        </AppText>
      </View>
      <AppText weight="semiBold" size={14}>
        {formatNLe(item.price, item.priceSuffix)}
      </AppText>
    </Pressable>
  );
}

function MemberRow({ item }: { item: Member }) {
  return (
    <Pressable
      onPress={() => router.push(`/member/${item.id}`)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Avatar name={item.name} size={48} color={item.kind === 'store' ? colors.primary : colors.navy} />
      <View style={styles.rowText}>
        <View style={styles.nameRow}>
          <AppText weight="medium" size={14} numberOfLines={1} style={styles.shrink}>
            {item.name}
          </AppText>
          {item.verified ? <VerifiedBadge size={14} /> : null}
        </View>
        <AppText size={12} color={colors.textMuted} numberOfLines={1}>
          {item.trade ?? item.storeCategory ?? 'Seller'} · {item.location}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGrey,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  rowText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shrink: {
    flexShrink: 1,
  },
});
