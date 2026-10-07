import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ListingGrid } from '@/components/ListingGrid';
import { LocationSheet } from '@/components/LocationSheet';
import { MemberRow } from '@/components/MemberRow';
import { Button, Chip, DemoNote, Field, SelectField } from '@/components/ui';
import { ALL_SIERRA_LEONE, isNearby } from '@/data/locations';
import { categories, type Category } from '@/data/mock';
import { formatNLe, timeAgo } from '@/lib/format';
import { ME, useStore, type NeedRequest } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const WHEN: NeedRequest['when'][] = ['Right now', 'Today', 'This week'];

export default function NeedItNowScreen() {
  const store = useStore();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>('services');
  const [place, setPlace] = useState(store.location === ALL_SIERRA_LEONE ? 'Freetown' : store.location);
  const [budget, setBudget] = useState('');
  const [when, setWhen] = useState<NeedRequest['when']>('Today');
  const [locationOpen, setLocationOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(store.requests[0]?.id ?? null);

  const active = store.requests.find((r) => r.id === activeId);

  const post = () => {
    if (text.trim().length < 3) {
      Alert.alert('What do you need?', 'Describe it in a few words, e.g. “I need an electrician in Lumley today”.');
      return;
    }
    const id = store.addRequest({
      text: text.trim(),
      category,
      location: place,
      budget: budget ? Number(budget.replace(/\D/g, '')) || undefined : undefined,
      when,
    });
    setActiveId(id);
    setText('');
    setBudget('');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText size={14} color={colors.textMuted}>
          Post what you need and get quick offers from nearby businesses and service providers.
        </AppText>

        <Field
          label="What do you need?"
          value={text}
          onChangeText={setText}
          placeholder="e.g. I need an electrician in Lumley today"
          multiline
        />

        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            Category
          </AppText>
          <View style={styles.wrap}>
            {categories.map((c) => (
              <Chip key={c.key} label={c.label} icon={c.icon} selected={category === c.key} onPress={() => setCategory(c.key)} />
            ))}
          </View>
        </View>

        <SelectField label="Location" value={place} onPress={() => setLocationOpen(true)} />
        <Field
          label="Budget (optional)"
          value={budget}
          onChangeText={setBudget}
          placeholder="e.g. 300"
          keyboardType="number-pad"
          hint="In New Leones (NLe)"
        />

        <View style={styles.group}>
          <AppText weight="medium" size={14}>
            When do you need it?
          </AppText>
          <View style={styles.wrap}>
            {WHEN.map((w) => (
              <Chip key={w} label={w} selected={when === w} onPress={() => setWhen(w)} />
            ))}
          </View>
        </View>

        <Button label="Post Request" icon="flash" onPress={post} />

        {active ? <Matches request={active} /> : null}

        {store.requests.length ? (
          <View style={styles.group}>
            <AppText weight="semiBold" size={17}>
              Your requests
            </AppText>
            {store.requests.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => setActiveId(r.id)}
                style={[styles.request, r.id === activeId && styles.requestActive]}
                accessibilityRole="button"
              >
                <Ionicons name="flash" size={20} color={colors.orange} />
                <View style={styles.flex}>
                  <AppText weight="medium" size={14} numberOfLines={2}>
                    {r.text}
                  </AppText>
                  <AppText size={12} color={colors.textMuted}>
                    {r.location} · {r.when}
                    {r.budget ? ` · ${formatNLe(r.budget)}` : ''} · {timeAgo(r.createdAt)}
                  </AppText>
                </View>
                <Pressable
                  onPress={() =>
                    Alert.alert('Delete request?', undefined, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => store.removeRequest(r.id) },
                    ])
                  }
                  hitSlop={10}
                  accessibilityLabel="Delete request"
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <LocationSheet
        visible={locationOpen}
        selected={place}
        onSelect={setPlace}
        onClose={() => setLocationOpen(false)}
      />
    </KeyboardAvoidingView>
  );
}

/** Instant matches for a request from what's already on RAYNO. */
function Matches({ request }: { request: NeedRequest }) {
  const { allListings, allMembers } = useStore();
  const words = request.text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2 && !['need', 'want', 'the', 'and', 'for', 'today', 'now', 'looking'].includes(w));
  const mentions = (...fields: (string | undefined)[]) =>
    words.some((w) => fields.some((f) => f?.toLowerCase().includes(w)));

  const providers = allMembers.filter(
    (m) => m.id !== ME && m.kind === 'provider' && mentions(m.trade, m.about) && isNearby(m.location, request.location),
  );
  const items = allListings.filter(
    (l) =>
      l.sellerId !== ME &&
      (l.category === request.category || mentions(l.title, l.description)) &&
      isNearby(l.location, request.location) &&
      (!request.budget || l.price <= request.budget * 1.2),
  );

  return (
    <View style={styles.group}>
      <AppText weight="semiBold" size={17}>
        Matches for “{request.text}”
      </AppText>
      <DemoNote>
        When RAYNO goes live, sellers near {request.location} get a notification and send you offers
        here. For now we show matches from what’s already listed.
      </DemoNote>
      {providers.map((m) => (
        <MemberRow key={m.id} member={m} />
      ))}
      {items.length ? <ListingGrid items={items.slice(0, 6)} /> : null}
      {!providers.length && !items.length ? (
        <AppText size={13} color={colors.textMuted}>
          No matches near {request.location} yet. Try another category or a nearby town.
        </AppText>
      ) : null}
    </View>
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
  request: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  requestActive: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
});
