import Constants from 'expo-constants';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/lib/theme';

const SECTIONS = [
  {
    title: 'Buying',
    body: 'Find an item on Home, Market or Search, tap it, then tap Chat to talk to the seller. Agree on price and where to meet. Check the item before paying.',
  },
  {
    title: 'Selling',
    body: 'Tap the blue + button, choose “Sell a Product”, add photos, a price and your location, then publish. Buyers will message you in Messages.',
  },
  {
    title: 'Services',
    body: 'Find electricians, plumbers, tailors and more under Services. To offer your own skills, tap + and choose “Offer a Service”.',
  },
  {
    title: 'I Need It Now',
    body: 'Post what you need, your budget and when you need it. Sellers and providers nearby will be able to send you offers.',
  },
  {
    title: 'Scanning',
    body: 'The scan icon in the search bar reads RAYNO QR codes on shop posters and stickers, and product barcodes (it searches for them).',
  },
  {
    title: 'Staying safe',
    body: 'Prefer verified sellers (blue tick). Meet in public places, check items before paying, and never send money in advance to strangers.',
  },
];

export default function HelpScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {SECTIONS.map((s) => (
        <View key={s.title} style={styles.card}>
          <AppText weight="semiBold" size={15}>
            {s.title}
          </AppText>
          <AppText size={13} color={colors.textMuted} style={styles.body}>
            {s.body}
          </AppText>
        </View>
      ))}
      <AppText size={12} color={colors.textMuted} style={styles.version}>
        RAYNO {Constants.expoConfig?.version ?? ''} · Your everyday app for Sierra Leone.
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  body: {
    marginTop: 4,
    lineHeight: 19,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
