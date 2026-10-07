import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui';
import { colors, radius, spacing } from '@/lib/theme';

/**
 * Scans QR codes and product barcodes.
 * - RAYNO links (rayno://listing/<id>, rayno://member/<id>) open that page.
 * - Anything else (a product barcode, a web link, text) is searched for.
 */
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const handled = useRef(false);

  const onScanned = ({ data }: BarcodeScanningResult) => {
    if (handled.current || !data) return;
    handled.current = true;

    const link = data.match(/(listing|member)\/([\w-]+)/);
    router.back();
    if (data.startsWith('rayno://') && link) {
      router.push(`/${link[1]}/${link[2]}` as '/listing/[id]');
    } else {
      router.navigate({ pathname: '/search', params: { q: data } });
    }
  };

  if (!permission) return <View style={styles.black} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permission}>
        <Ionicons name="camera-outline" size={48} color={colors.primary} />
        <AppText weight="semiBold" size={18} style={styles.center}>
          Allow camera to scan
        </AppText>
        <AppText size={14} color={colors.textMuted} style={styles.center}>
          Scan a RAYNO QR code from a shop or poster to open it, or scan a product barcode to search
          for it.
        </AppText>
        {permission.canAskAgain ? (
          <Button label="Allow camera" onPress={requestPermission} style={styles.wide} />
        ) : (
          <Button label="Open Settings" onPress={() => Linking.openSettings()} style={styles.wide} />
        )}
        <Button label="Cancel" variant="secondary" onPress={() => router.back()} style={styles.wide} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.black}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={onScanned}
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton} accessibilityLabel="Close">
            <Ionicons name="close" size={26} color={colors.white} />
          </Pressable>
          <Pressable
            onPress={() => setTorch((t) => !t)}
            style={styles.iconButton}
            accessibilityLabel={torch ? 'Turn off flashlight' : 'Turn on flashlight'}
          >
            <Ionicons name={torch ? 'flash' : 'flash-outline'} size={24} color={colors.white} />
          </Pressable>
        </View>
        <View style={styles.frame} />
        <AppText weight="medium" size={14} color={colors.white} style={styles.hint}>
          Point at a QR code or barcode
        </AppText>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  black: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
  },
  topBar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    marginTop: '25%',
    width: 250,
    height: 250,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.white,
  },
  hint: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  permission: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  center: {
    textAlign: 'center',
  },
  wide: {
    alignSelf: 'stretch',
  },
});
