import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { DemoNote } from '@/components/ui';
import { colors, radius, spacing } from '@/lib/theme';

// DRAFT wording. Have a Sierra Leone lawyer review before publishing.
const SECTIONS = [
  {
    title: 'Privacy policy (summary)',
    points: [
      'We collect your phone number, name, location (town/district), listings, photos, messages and orders so the app can work.',
      'Card payments are handled by our licensed payment partner. RAYNO never stores your full card number or CVC.',
      'Mobile money payments are processed by Orange Money or Afrimoney through our payment partner.',
      'Your phone number is only shown to people you trade with, and only when you choose to share it.',
      'We never sell your personal data. We use it to run RAYNO, prevent fraud and improve the service.',
      'You can download or delete your data at any time from Settings → Delete account.',
    ],
  },
  {
    title: 'Terms of use (summary)',
    points: [
      'You must be 18+ to sell or to pay through RAYNO.',
      'Only list items you own and are allowed to sell. No stolen, fake, illegal or dangerous goods.',
      'Describe items honestly and use your own photos.',
      'Payments made through RAYNO are protected: the seller is paid after the buyer confirms delivery or after the protection period ends.',
      'Report scams, fake items or abuse with the Report button. We may remove listings and suspend accounts.',
      'RAYNO connects buyers and sellers; each seller is responsible for their items and services.',
    ],
  },
];

export default function LegalScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <DemoNote>Draft summary for the demo. The full policy and terms will be reviewed by a lawyer before launch.</DemoNote>
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.card}>
          <AppText weight="semiBold" size={16}>
            {section.title}
          </AppText>
          {section.points.map((point) => (
            <View key={point} style={styles.point}>
              <AppText size={13}>•</AppText>
              <AppText size={13} style={styles.pointText}>
                {point}
              </AppText>
            </View>
          ))}
        </View>
      ))}
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
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  point: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pointText: {
    flex: 1,
    lineHeight: 19,
  },
});
