import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { colors } from '@/lib/theme';

type Weight = 'regular' | 'medium' | 'semiBold' | 'bold';

const weights: Record<Weight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
};

type Props = TextProps & {
  weight?: Weight;
  size?: number;
  color?: string;
};

/** App text with a single consistent type scale. */
export function AppText({ weight = 'regular', size = 14, color = colors.text, style, ...rest }: Props) {
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[styles.base, { fontWeight: weights[weight], fontSize: size, color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
