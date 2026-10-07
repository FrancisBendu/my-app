import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { BottomSheet } from './BottomSheet';
import { locations } from '@/data/mock';
import { colors, spacing } from '@/lib/theme';

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (location: string) => void;
  onClose: () => void;
};

export function LocationSheet({ visible, selected, onSelect, onClose }: Props) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Choose your location">
      <ScrollView style={styles.list}>
        {locations.map((loc) => {
          const active = loc === selected;
          return (
            <Pressable
              key={loc}
              onPress={() => {
                onSelect(loc);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              style={styles.row}
            >
              <Ionicons
                name="location-outline"
                size={18}
                color={active ? colors.primary : colors.textMuted}
              />
              <AppText
                weight={active ? 'semiBold' : 'regular'}
                size={15}
                color={active ? colors.primary : colors.text}
                style={styles.label}
              >
                {loc}
              </AppText>
              {active ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    maxHeight: 360,
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
});
