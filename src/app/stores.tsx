import { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { MemberRow } from '@/components/MemberRow';
import { DemoNote } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function StoresScreen() {
  const { allMembers, allListings } = useStore();

  const stores = useMemo(
    () =>
      allMembers
        .filter((m) => m.kind === 'store')
        .sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating),
    [allMembers],
  );

  return (
    <FlatList
      style={styles.screen}
      data={stores}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <DemoNote>
          A blue tick means RAYNO checked the business documents and owner ID. Prefer verified stores
          for expensive items.
        </DemoNote>
      }
      renderItem={({ item }) => (
        <MemberRow
          member={item}
          extra={`${allListings.filter((l) => l.sellerId === item.id).length} products`}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
});
