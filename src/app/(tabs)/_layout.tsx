import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { CreateSheet } from '@/components/CreateSheet';
import { colors, shadows } from '@/lib/theme';
import type { IconName } from '@/data/mock';

type TabRenderProps = { focused: boolean; color: ColorValue };

function TabIcon({
  focused,
  color,
  active,
  inactive,
}: TabRenderProps & { active: IconName; inactive: IconName }) {
  return <Ionicons name={focused ? active : inactive} size={26} color={color} />;
}

function TabLabel({ focused, color, label }: TabRenderProps & { label: string }) {
  return (
    <AppText
      weight={focused ? 'semiBold' : 'regular'}
      size={12}
      color={String(color)}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      style={styles.label}
    >
      {label}
    </AppText>
  );
}

export default function TabsLayout() {
  const [createOpen, setCreateOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#5B6675',
          tabBarStyle: {
            height: 68 + insets.bottom,
            paddingTop: 8,
            borderTopWidth: 0,
            backgroundColor: colors.white,
            boxShadow: '0px -2px 12px rgba(11, 31, 59, 0.06)',
          },
          animation: 'none',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: (p) => <TabLabel {...p} label="Home" />,
            tabBarIcon: (p) => <TabIcon {...p} active="home" inactive="home-outline" />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarLabel: (p) => <TabLabel {...p} label="Search" />,
            tabBarIcon: (p) => <TabIcon {...p} active="search" inactive="search-outline" />,
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarButton: () => (
              <View style={styles.createSlot}>
                <Pressable
                  onPress={() => setCreateOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Create: sell, offer a service or post what you need"
                  style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}
                >
                  <Ionicons name="add" size={36} color={colors.white} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarLabel: (p) => <TabLabel {...p} label="Messages" />,
            tabBarIcon: (p) => (
              <TabIcon {...p} active="chatbox-ellipses" inactive="chatbox-ellipses-outline" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: (p) => <TabLabel {...p} label="Profile" />,
            tabBarIcon: (p) => <TabIcon {...p} active="person" inactive="person-outline" />,
          }}
        />
      </Tabs>
      <CreateSheet visible={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 2,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  createSlot: {
    flex: 1,
    alignItems: 'center',
  },
  createButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginTop: -16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.raised,
  },
  pressed: {
    opacity: 0.88,
  },
});
