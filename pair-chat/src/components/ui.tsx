import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
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
import { initials } from '@/lib/format';
import { colors, radius, spacing } from '@/lib/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type ButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, icon, variant = 'primary', disabled, style }: ButtonProps) {
  const primary = variant === 'primary';
  const fg = primary ? colors.white : colors.primary;
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

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
};

export function Field({ label, hint, style, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText weight="medium" size={14}>
        {label}
      </AppText>
      <TextInput placeholderTextColor={colors.textMuted} style={[styles.input, style]} {...rest} />
      {hint ? (
        <AppText size={12} color={colors.textMuted}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

export function Avatar({ name, size = 48, color = colors.primary }: { name: string; size?: number; color?: string }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <AppText weight="semiBold" size={size * 0.36} color={colors.white}>
        {initials(name) || '?'}
      </AppText>
    </View>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={40} color={colors.primary} />
      <AppText weight="semiBold" size={16} style={styles.center}>
        {title}
      </AppText>
      <AppText size={13} color={colors.textMuted} style={styles.emptyBody}>
        {body}
      </AppText>
      {action}
    </View>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <View style={styles.note}>
      <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
      <AppText size={12} color={colors.text} style={styles.noteText}>
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
    backgroundColor: colors.primarySoft,
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
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.xs,
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
    backgroundColor: colors.primarySoft,
  },
  noteText: {
    flex: 1,
    lineHeight: 18,
  },
});
