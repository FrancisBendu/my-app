import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '@/lib/store';
import { colors, fonts } from '@/lib/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.navy,
          headerTitleStyle: { fontFamily: fonts.semiBold, fontSize: 17 },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.white },
          animation: 'default',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="need-it-now" options={{ title: 'I Need It Now' }} />
        <Stack.Screen name="market" options={{ title: 'Market' }} />
        <Stack.Screen name="services" options={{ title: 'Services' }} />
        <Stack.Screen name="stores" options={{ title: 'Stores' }} />
        <Stack.Screen name="deals" options={{ title: 'Deals' }} />
        <Stack.Screen name="listing/[id]" options={{ title: '' }} />
        <Stack.Screen name="member/[id]" options={{ title: '' }} />
        <Stack.Screen name="chat/[id]" options={{ title: '' }} />
        <Stack.Screen name="scan" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
        <Stack.Screen name="sell" options={{ title: 'Sell a Product' }} />
        <Stack.Screen name="offer-service" options={{ title: 'Offer a Service' }} />
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="saved" options={{ title: 'Saved Items' }} />
        <Stack.Screen name="my-listings" options={{ title: 'My Listings' }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="help" options={{ title: 'Help & About' }} />
        <Stack.Screen name="cart" options={{ title: 'Cart' }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
        <Stack.Screen name="order/[id]" options={{ title: 'Order' }} />
        <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="legal" options={{ title: 'Privacy & Terms' }} />
      </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
