import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/lib/auth';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.text, fontWeight: '600', fontSize: 17 },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Tether' }} />
          <Stack.Screen name="sign-in" options={{ title: 'Sign in', presentation: 'modal' }} />
          <Stack.Screen name="connect" options={{ title: 'New chat' }} />
          <Stack.Screen name="chat/[id]" options={{ title: '' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
