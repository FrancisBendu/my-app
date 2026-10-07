import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { LocationSheet } from '@/components/LocationSheet';
import { Button, DemoNote, Field, SelectField } from '@/components/ui';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useStore();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [locationOpen, setLocationOpen] = useState(false);

  const save = () => {
    const digits = phone.replace(/\D/g, '');
    if (phone && digits.length < 8) {
      Alert.alert('Check your number', 'Enter a Sierra Leone number like 076 123 456.');
      return;
    }
    updateProfile({ name: name.trim(), phone: phone.trim(), location });
    router.back();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Field label="Full name" value={name} onChangeText={setName} placeholder="e.g. Francis Bendu" autoCapitalize="words" />
      <Field
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        placeholder="e.g. 076 123 456"
        keyboardType="phone-pad"
        hint="Later you will sign in with this number using a one-time SMS code."
      />
      <SelectField label="Where are you based?" value={location} onPress={() => setLocationOpen(true)} />
      <DemoNote>Your profile is saved on this phone only until RAYNO accounts go live.</DemoNote>
      <Button label="Save" icon="checkmark" onPress={save} />
      <LocationSheet visible={locationOpen} selected={location} onSelect={setLocation} onClose={() => setLocationOpen(false)} />
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
    gap: spacing.lg,
  },
});
