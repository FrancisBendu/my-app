import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { LocationSheet } from '@/components/LocationSheet';
import { Button, Chip, Field, SelectField } from '@/components/ui';
import { ALL_SIERRA_LEONE } from '@/data/locations';
import { trades } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, spacing } from '@/lib/theme';

export default function OfferServiceScreen() {
  const store = useStore();
  const [name, setName] = useState(store.profile.name);
  const [trade, setTrade] = useState<string | null>(null);
  const [otherTrade, setOtherTrade] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [place, setPlace] = useState(
    store.profile.location || (store.location === ALL_SIERRA_LEONE ? 'Freetown' : store.location),
  );
  const [about, setAbout] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);

  const save = () => {
    const finalTrade = trade === 'Other' ? otherTrade.trim() : trade;
    if (!name.trim() || !finalTrade) {
      Alert.alert('Almost there', 'Please add your name and the service you offer.');
      return;
    }
    const id = store.addService({
      name: name.trim(),
      trade: finalTrade,
      priceFrom: Number(priceFrom.replace(/\D/g, '')) || undefined,
      location: place,
      about: about.trim(),
    });
    router.replace(`/member/${id}`);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText size={14} color={colors.textMuted}>
          List your skills so people nearby can find and hire you.
        </AppText>
        <Field label="Your name or business name" value={name} onChangeText={setName} placeholder="e.g. Alhaji Kamara" />
        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            What service do you offer?
          </AppText>
          <View style={styles.wrap}>
            {[...trades, 'Other'].map((t) => (
              <Chip key={t} label={t} selected={trade === t} onPress={() => setTrade(t)} />
            ))}
          </View>
          {trade === 'Other' ? (
            <Field label="Service" value={otherTrade} onChangeText={setOtherTrade} placeholder="e.g. Carpenter, Hairdresser" />
          ) : null}
        </View>
        <Field
          label="Starting price (NLe, optional)"
          value={priceFrom}
          onChangeText={setPriceFrom}
          placeholder="e.g. 200"
          keyboardType="number-pad"
        />
        <SelectField label="Where do you work?" value={place} onPress={() => setLocationOpen(true)} />
        <Field
          label="About your work"
          value={about}
          onChangeText={setAbout}
          placeholder="Experience, what you do, working hours..."
          multiline
        />
        <Button label="Publish my service" icon="checkmark" onPress={save} />
      </ScrollView>
      <LocationSheet visible={locationOpen} selected={place} onSelect={setPlace} onClose={() => setLocationOpen(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  group: {
    gap: spacing.sm,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
