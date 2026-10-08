import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar, Button, DemoNote } from '@/components/ui';
import type { IconName } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

export default function ProfileScreen() {
  const { profile, myListings, myServices, savedIds, conversations, requests, orders, cart, resetDemo } = useStore();
  const hasProfile = Boolean(profile.name.trim());

  const stats = [
    { label: 'Orders', value: orders.length, href: '/orders' as Href },
    { label: 'Listings', value: myListings.length, href: '/my-listings' as Href },
    { label: 'Saved', value: savedIds.length, href: '/saved' as Href },
    { label: 'Chats', value: conversations.length, href: '/messages' as Href },
  ];

  const menu: { label: string; icon: IconName; href: Href; detail?: string }[] = [
    { label: 'My Orders', icon: 'receipt-outline', href: '/orders', detail: String(orders.length) },
    { label: 'Cart', icon: 'cart-outline', href: '/cart', detail: String(cart.reduce((n, c) => n + c.qty, 0)) },
    { label: 'My Listings', icon: 'cube-outline', href: '/my-listings', detail: String(myListings.length) },
    { label: 'Saved Items', icon: 'heart-outline', href: '/saved', detail: String(savedIds.length) },
    { label: 'My Requests', icon: 'flash-outline', href: '/need-it-now', detail: String(requests.length) },
    ...myServices.map((s) => ({
      label: `My service: ${s.trade}`,
      icon: 'construct-outline' as IconName,
      href: `/member/${s.id}` as Href,
    })),
    { label: 'Sell a Product', icon: 'bag-add-outline', href: '/sell' },
    { label: 'Offer a Service', icon: 'hammer-outline', href: '/offer-service' },
    { label: 'Notifications', icon: 'notifications-outline', href: '/notifications' },
    { label: 'Settings', icon: 'settings-outline', href: '/settings' },
    { label: 'Help & About', icon: 'help-circle-outline', href: '/help' },
  ];

  const reset = () =>
    Alert.alert('Reset demo data?', 'This deletes your listings, chats, saved items and profile on this phone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetDemo },
    ]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.push('/settings')} style={styles.gear} hitSlop={10} accessibilityLabel="Settings">
          <Ionicons name="settings-outline" size={24} color={colors.navy} />
        </Pressable>
        <View style={styles.header}>
          <Avatar name={hasProfile ? profile.name : '?'} size={68} />
          <View style={styles.flex}>
            <AppText weight="semiBold" size={19}>
              {hasProfile ? profile.name : 'Welcome to RAYNO'}
            </AppText>
            <AppText size={13} color={colors.textMuted}>
              {hasProfile ? [profile.phone, profile.location].filter(Boolean).join(' · ') : 'Add your name so sellers know who they’re talking to.'}
            </AppText>
          </View>
        </View>
        <Button
          label={hasProfile ? 'Edit profile' : 'Set up your profile'}
          icon="create-outline"
          variant="secondary"
          onPress={() => router.push('/edit-profile')}
          style={styles.editButton}
        />

        <View style={styles.stats}>
          {stats.map((stat) => (
            <Pressable key={stat.label} onPress={() => router.push(stat.href)} style={styles.stat} accessibilityRole="button">
              <AppText weight="semiBold" size={18}>
                {stat.value}
              </AppText>
              <AppText size={12} color={colors.textMuted}>
                {stat.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        {menu.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.href)}
            style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Ionicons name={item.icon} size={20} color={colors.navy} />
            <AppText size={15} style={styles.flex}>
              {item.label}
            </AppText>
            {item.detail ? (
              <AppText size={13} color={colors.textMuted}>
                {item.detail}
              </AppText>
            ) : null}
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}

        <View style={styles.note}>
          <DemoNote>
            Demo version: your profile, listings, chats and saved items are stored on this phone only.
            Sign-in with your phone number, real sellers and payments come with the RAYNO server.
          </DemoNote>
        </View>
        <Pressable onPress={reset} style={styles.reset} accessibilityRole="button">
          <AppText size={13} color={colors.red}>
            Reset demo data
          </AppText>
        </Pressable>
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
    paddingBottom: spacing.xl * 2,
  },
  gear: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  flex: {
    flex: 1,
  },
  editButton: {
    marginTop: spacing.lg,
    height: 44,
  },
  stats: {
    flexDirection: 'row',
    marginVertical: spacing.lg,
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
  pressed: {
    opacity: 0.6,
  },
  note: {
    marginTop: spacing.xl,
  },
  reset: {
    alignSelf: 'center',
    padding: spacing.md,
    marginTop: spacing.sm,
  },
});
