import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { currentUser, type IconName } from '@/data/mock';
import { colors, radius, spacing } from '@/lib/theme';

const MENU: { label: string; icon: IconName }[] = [
  { label: 'My Products', icon: 'cube-outline' },
  { label: 'Orders', icon: 'receipt-outline' },
  { label: 'Store Settings', icon: 'settings-outline' },
  { label: 'Verification', icon: 'shield-checkmark-outline' },
  { label: 'Help & Support', icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
  const stats = [
    { label: 'Products', value: String(currentUser.products) },
    { label: 'Views', value: currentUser.views },
    { label: 'Sales', value: String(currentUser.sales) },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.white} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <AppText weight="semiBold" size={18}>
                {currentUser.name}
              </AppText>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            </View>
            <AppText size={13} color={colors.textMuted}>
              {currentUser.role}
            </AppText>
            <AppText size={13}>
              ⭐ {currentUser.rating} ({currentUser.reviews} reviews)
            </AppText>
          </View>
        </View>

        <View style={styles.stats}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <AppText weight="semiBold" size={18}>
                {stat.value}
              </AppText>
              <AppText size={12} color={colors.textMuted}>
                {stat.label}
              </AppText>
            </View>
          ))}
        </View>

        {MENU.map((item) => (
          <Pressable key={item.label} style={styles.menuRow} accessibilityRole="button">
            <Ionicons name={item.icon} size={20} color={colors.navy} />
            <AppText size={15} style={styles.menuLabel}>
              {item.label}
            </AppText>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stats: {
    flexDirection: 'row',
    marginVertical: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.lightGrey,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
  },
});
