import { StyleSheet, Text, type TextProps } from 'react-native';
import { colors, fonts } from '@/lib/theme';

type Weight = keyof typeof fonts;

type Props = TextProps & {
  weight?: Weight;
  size?: number;
  color?: string;
};

/** Text that always uses Poppins and the brand text colour. */
export function AppText({ weight = 'regular', size = 14, color = colors.text, style, ...rest }: Props) {
  return (
    <Text
      // Respect the phone's text size, but cap it so cards and tab labels keep their layout.
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[styles.base, { fontFamily: fonts[weight], fontSize: size, color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
