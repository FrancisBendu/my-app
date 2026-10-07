import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors } from '@/lib/theme';

/** Lightweight RAYNO wordmark built from views — no image download needed. */
export function Logo({ size = 28 }: { size?: number }) {
  const mark = size * 1.15;
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="RAYNO">
      <View style={[styles.mark, { width: mark, height: mark, borderRadius: mark * 0.22 }]}>
        <AppText weight="bold" size={size * 0.85} color={colors.white} style={styles.markText}>
          R
        </AppText>
        <View style={[styles.accent, { width: mark * 0.38, height: mark * 0.38 }]} />
      </View>
      <AppText weight="bold" size={size} style={styles.word}>
        <AppText weight="bold" size={size} color={colors.navy}>
          RAY
        </AppText>
        <AppText weight="bold" size={size} color={colors.primary}>
          NO
        </AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  markText: {
    zIndex: 1,
  },
  accent: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: colors.green,
    borderTopRightRadius: 6,
  },
  word: {
    letterSpacing: 0.5,
  },
});
