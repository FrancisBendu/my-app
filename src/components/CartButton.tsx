import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useStore } from '@/lib/store';
import { colors } from '@/lib/theme';

export function CartButton({ size = 26 }: { size?: number }) {
  const { cart } = useStore();
  const count = cart.reduce((n, c) => n + c.qty, 0);
  return (
    <Pressable
      onPress={() => router.push('/cart')}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={count ? `Cart, ${count} items` : 'Cart'}
    >
      <Ionicons name="cart-outline" size={size} color={colors.navy} />
      {count > 0 ? (
        <View style={styles.badge}>
          <AppText weight="semiBold" size={10} color={colors.white}>
            {count > 99 ? '99+' : count}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
