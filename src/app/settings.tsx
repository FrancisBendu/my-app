import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { LocationSheet } from '@/components/LocationSheet';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

type Row = { label: string; value?: string; onPress: () => void; danger?: boolean };

export default function SettingsScreen() {
  const { profile, updateProfile, resetDemo } = useStore();
  const [locationOpen, setLocationOpen] = useState(false);
  const go = (href: Href) => () => router.push(href);

  const groups: Row[][] = [
    [{ label: 'My profile', onPress: go('/edit-profile') }],
    [
      { label: 'Deliver to', value: profile.location, onPress: () => setLocationOpen(true) },
      { label: 'Currency', value: 'NLe', onPress: () => Alert.alert('Currency', 'RAYNO shows prices in New Leones (NLe).') },
      {
        label: 'Language',
        value: 'English',
        onPress: () => Alert.alert('Language', 'Krio is planned. Tell us which other languages you need.'),
      },
      { label: 'Notifications', onPress: go('/notifications') },
      {
        label: 'Payment methods',
        value: 'Orange · Afri · Card',
        onPress: () =>
          Alert.alert(
            'Payment methods',
            'Pay with Orange Money, Afrimoney, Visa or Mastercard bank cards, or cash on delivery. You choose at checkout.',
          ),
      },
    ],
    [
      { label: 'Privacy policy & terms', onPress: go('/legal') },
      { label: 'Help & About', onPress: go('/help') },
      { label: 'Rate the app', onPress: () => Alert.alert('Thank you!', 'Rating opens once RAYNO is in the App Store and Play Store.') },
      {
        label: 'Clear app cache',
        onPress: async () => {
          await Image.clearDiskCache();
          await Image.clearMemoryCache();
          Alert.alert('Done', 'Cached images were cleared.');
        },
      },
    ],
    [
      {
        label: 'Delete account',
        danger: true,
        onPress: () =>
          Alert.alert('Delete account?', 'This permanently deletes your profile, listings, chats and orders.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: resetDemo },
          ]),
      },
      {
        label: 'Sign out',
        onPress: () => Alert.alert('Sign out', 'Sign-in with your phone number arrives with the RAYNO server.'),
      },
    ],
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {groups.map((rows, i) => (
        <View key={i} style={styles.group}>
          {rows.map((row) => (
            <Pressable key={row.label} onPress={row.onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]} accessibilityRole="button">
              <AppText size={15} color={row.danger ? colors.red : colors.text} style={styles.flex}>
                {row.label}
              </AppText>
              {row.value ? (
                <AppText size={13} color={colors.textMuted} numberOfLines={1} style={styles.value}>
                  {row.value}
                </AppText>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      ))}
      <AppText size={12} color={colors.textMuted} style={styles.version}>
        Version {Constants.expoConfig?.version ?? '1.0.0'} (demo)
      </AppText>
      <LocationSheet
        visible={locationOpen}
        selected={profile.location}
        onSelect={(location) => updateProfile({ ...profile, location })}
        onClose={() => setLocationOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  content: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  group: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    backgroundColor: colors.lightGrey,
  },
  flex: {
    flex: 1,
  },
  value: {
    maxWidth: 170,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
