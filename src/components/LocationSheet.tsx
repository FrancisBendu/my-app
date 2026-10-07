import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { AppText } from './AppText';
import { BottomSheet } from './BottomSheet';
import { ALL_SIERRA_LEONE, places, regions, type Place } from '@/data/locations';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (location: string) => void;
  onClose: () => void;
  /** Show "All of Sierra Leone" at the top (for browsing, not for posting). */
  allowAll?: boolean;
};

type Section = { title: string; data: Place[] };

export function LocationSheet({ visible, selected, onSelect, onClose, allowAll = false }: Props) {
  const [query, setQuery] = useState('');
  const { height } = useWindowDimensions();

  const sections = useMemo<Section[]>(() => {
    const q = query.trim().toLowerCase();
    const matches = (p: Place) =>
      !q ||
      p.label.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q);
    return regions.flatMap((region) =>
      region.districts
        .map((district) => ({
          title: `${district.name} · ${region.name}`,
          data: places.filter((p) => p.district === district.name && matches(p)),
        }))
        .filter((section) => section.data.length > 0),
    );
  }, [query]);

  const choose = (label: string) => {
    onSelect(label);
    setQuery('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Choose your location">
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search town, district or area"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
        />
      </View>
      <SectionList
        style={{ height: height * 0.55 }}
        sections={sections}
        keyExtractor={(item) => item.label}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled
        initialNumToRender={20}
        ListHeaderComponent={
          allowAll && !query ? (
            <Row label={ALL_SIERRA_LEONE} icon="globe-outline" active={selected === ALL_SIERRA_LEONE} onPress={() => choose(ALL_SIERRA_LEONE)} />
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <AppText weight="semiBold" size={12} color={colors.textMuted}>
              {section.title.toUpperCase()}
            </AppText>
          </View>
        )}
        renderItem={({ item }) => (
          <Row label={item.label} icon="location-outline" active={item.label === selected} onPress={() => choose(item.label)} />
        )}
        ListEmptyComponent={
          <AppText color={colors.textMuted} style={styles.empty}>
            No place matches “{query}”.
          </AppText>
        }
      />
    </BottomSheet>
  );
}

function Row({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: 'location-outline' | 'globe-outline';
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={styles.row}
    >
      <Ionicons name={icon} size={18} color={active ? colors.primary : colors.textMuted} />
      <AppText
        weight={active ? 'semiBold' : 'regular'}
        size={15}
        color={active ? colors.primary : colors.text}
        style={styles.label}
      >
        {label}
      </AppText>
      {active ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  sectionHeader: {
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
