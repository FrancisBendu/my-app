import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { LocationSheet } from '@/components/LocationSheet';
import { Button, Chip, Field, SelectField } from '@/components/ui';
import { ALL_SIERRA_LEONE } from '@/data/locations';
import { categories, type Category, type Listing } from '@/data/mock';
import { useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const MAX_PHOTOS = 4;
// Small, compressed photos keep uploads fast on slow connections.
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.4,
  allowsEditing: true,
  aspect: [5, 4],
};

export default function SellScreen() {
  const store = useStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [condition, setCondition] = useState<Listing['condition']>('Used');
  const [place, setPlace] = useState(
    store.profile.location || (store.location === ALL_SIERRA_LEONE ? 'Freetown' : store.location),
  );
  const [description, setDescription] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);

  const addPhoto = async (source: 'camera' | 'library') => {
    if (photos.length >= MAX_PHOTOS) return;
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'camera' : 'photos'} access in Settings to add pictures.`);
      return;
    }
    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (!result.canceled) setPhotos((p) => [...p, result.assets[0].uri].slice(0, MAX_PHOTOS));
  };

  const choosePhoto = () =>
    Alert.alert('Add a photo', undefined, [
      { text: 'Take photo', onPress: () => addPhoto('camera') },
      { text: 'Choose from gallery', onPress: () => addPhoto('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const publish = () => {
    const amount = Number(price.replace(/\D/g, ''));
    const problems = [
      !title.trim() && 'a title',
      !amount && 'a price',
      !category && 'a category',
    ].filter(Boolean);
    if (problems.length) {
      Alert.alert('Almost there', `Please add ${problems.join(', ')}.`);
      return;
    }
    const id = store.addListing({
      title: title.trim(),
      price: amount,
      category: category!,
      condition,
      location: place,
      description: description.trim(),
      image: photos[0],
      images: photos,
    });
    router.replace(`/listing/${id}`);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            Photos ({photos.length}/{MAX_PHOTOS})
          </AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
            {photos.map((uri) => (
              <View key={uri}>
                <Image source={uri} style={styles.photo} contentFit="cover" />
                <Pressable
                  onPress={() => setPhotos((p) => p.filter((x) => x !== uri))}
                  style={styles.removePhoto}
                  hitSlop={6}
                  accessibilityLabel="Remove photo"
                >
                  <Ionicons name="close" size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
            {photos.length < MAX_PHOTOS ? (
              <Pressable onPress={choosePhoto} style={[styles.photo, styles.addPhoto]} accessibilityRole="button" accessibilityLabel="Add photo">
                <Ionicons name="camera-outline" size={26} color={colors.primary} />
                <AppText size={12} color={colors.primary}>
                  Add photo
                </AppText>
              </Pressable>
            ) : null}
          </ScrollView>
          <AppText size={12} color={colors.textMuted}>
            Clear photos in daylight sell faster. The first photo is the cover.
          </AppText>
        </View>

        <Field label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Samsung Galaxy A15, 128GB" maxLength={70} />
        <Field label="Price (NLe)" value={price} onChangeText={setPrice} placeholder="e.g. 3200" keyboardType="number-pad" />

        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            Category
          </AppText>
          <View style={styles.wrap}>
            {categories
              .filter((c) => c.key !== 'services')
              .map((c) => (
                <Chip key={c.key} label={c.label} icon={c.icon} selected={category === c.key} onPress={() => setCategory(c.key)} />
              ))}
          </View>
        </View>

        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            Condition
          </AppText>
          <View style={styles.wrap}>
            {(['New', 'Used'] as const).map((c) => (
              <Chip key={c} label={c} selected={condition === c} onPress={() => setCondition(c)} />
            ))}
          </View>
        </View>

        <SelectField label="Location" value={place} onPress={() => setLocationOpen(true)} />
        <Field
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Size, colour, how long you used it, delivery..."
          multiline
          maxLength={1000}
        />

        <Button label="Publish listing" icon="checkmark" onPress={publish} />
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
  photos: {
    gap: spacing.sm,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
  },
  addPhoto: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  removePhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
