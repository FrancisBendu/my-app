import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { nearYou, trendingToday } from '@/data/mock';
import { formatNLe } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/lib/theme';

const ALL_LISTINGS = [...nearYou, ...trendingToday];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_LISTINGS;
    return ALL_LISTINGS.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

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
          placeholder="What do you need today?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AppText color={colors.textMuted} style={styles.empty}>
            No results for “{query}”.
          </AppText>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.thumb, { backgroundColor: item.tint }]}>
              <Ionicons name={item.icon} size={22} color={colors.navy} />
            </View>
            <View style={styles.rowText}>
              <AppText weight="medium" size={14} numberOfLines={1}>
                {item.title}
              </AppText>
              <AppText size={12} color={colors.textMuted}>
                {item.location}
              </AppText>
            </View>
            <AppText weight="semiBold" size={14}>
              {formatNLe(item.price, item.priceSuffix)}
            </AppText>
          </View>
        )}
      />
    </SafeAreaView>
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
  list: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
