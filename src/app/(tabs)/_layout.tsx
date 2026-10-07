import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreateSheet } from '@/components/CreateSheet';
import { colors, fonts } from '@/lib/theme';
import type { IconName } from '@/data/mock';

function tabIcon(active: IconName, inactive: IconName) {
  return ({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) => (
    <Ionicons name={focused ? active : inactive} size={size} color={color} />
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
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14 },
          tabBarStyle: {
            borderTopColor: colors.border,
            height: 62 + insets.bottom,
            paddingTop: 6,
          },
          animation: 'none',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }}
        />
        <Tabs.Screen
          name="search"
          options={{ title: 'Search', tabBarIcon: tabIcon('search', 'search-outline') }}
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
                  <Ionicons name="add" size={34} color={colors.white} />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: tabIcon('chatbubble-ellipses', 'chatbubble-ellipses-outline'),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
        />
      </Tabs>
      <CreateSheet visible={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  createSlot: {
    flex: 1,
    alignItems: 'center',
  },
  createButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  pressed: {
    opacity: 0.85,
  },
});
