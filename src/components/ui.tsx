import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import type { IconName } from '@/data/mock';
import { initials } from '@/lib/format';
import { colors, fonts, radius, spacing } from '@/lib/theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, icon, variant = 'primary', disabled, style }: ButtonProps) {
  const primary = variant === 'primary';
  const fg = primary ? colors.white : variant === 'danger' ? colors.red : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonSecondary,
        (pressed || disabled) && { opacity: disabled ? 0.45 : 0.85 },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <AppText weight="semiBold" size={15} color={fg}>
        {label}
      </AppText>
    </Pressable>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
};

export function Chip({ label, selected, onPress, icon }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {icon ? <Ionicons name={icon} size={14} color={selected ? colors.white : colors.navy} /> : null}
      <AppText weight="medium" size={13} color={selected ? colors.white : colors.navy}>
        {label}
      </AppText>
    </Pressable>
  );
}

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
};

export function Field({ label, hint, style, multiline, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText weight="medium" size={14}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colors.textMuted}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline, style]}
        {...rest}
      />
      {hint ? (
        <AppText size={12} color={colors.textMuted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

/** A tappable row that looks like a form field, e.g. for picking a location. */
export function SelectField({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <View style={styles.field}>
      <AppText weight="medium" size={14}>
        {label}
      </AppText>
      <Pressable onPress={onPress} style={[styles.input, styles.select]} accessibilityRole="button">
        <AppText size={15}>{value}</AppText>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

export function Avatar({ name, size = 48, color = colors.navy }: { name: string; size?: number; color?: string }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <AppText weight="semiBold" size={size * 0.34} color={colors.white}>
        {initials(name) || '?'}
      </AppText>
    </View>
  );
}

export function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  if (!reviews) {
    return (
      <AppText size={12} color={colors.textMuted}>
        New on RAYNO
      </AppText>
    );
  }
  return (
    <View style={styles.row}>
      <Ionicons name="star" size={12} color="#FFB800" />
      <AppText size={12}>
        {rating.toFixed(1)}{' '}
        <AppText size={12} color={colors.textMuted}>
          ({reviews})
        </AppText>
      </AppText>
    </View>
  );
}

export function VerifiedBadge({ size = 15 }: { size?: number }) {
  return <Ionicons name="checkmark-circle" size={size} color={colors.primary} accessibilityLabel="Verified" />;
}

export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={40} color={colors.textMuted} />
      <AppText weight="semiBold" size={16} style={styles.emptyTitle}>
        {title}
      </AppText>
      <AppText size={13} color={colors.textMuted} style={styles.emptyBody}>
        {body}
      </AppText>
      {action}
    </View>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <View style={styles.note}>
      <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
      <AppText size={12} color={colors.navy} style={styles.noteText}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: '#E6F0FF',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.lightGrey,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  field: {
    gap: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: '#E6F0FF',
  },
  noteText: {
    flex: 1,
    lineHeight: 18,
  },
});
