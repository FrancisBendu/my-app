import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ListingGrid } from '@/components/ListingGrid';
import { Avatar, Button, EmptyState, Rating, VerifiedBadge } from '@/components/ui';
import { formatNLe } from '@/lib/format';
import { ME, useStore } from '@/lib/store';
import { colors, radius, spacing } from '@/lib/theme';

const KIND_LABEL = { store: 'Store', person: 'Seller', provider: 'Service provider' } as const;

export default function MemberScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMember, allListings, openConversation } = useStore();
  const member = getMember(id);
  const items = useMemo(() => allListings.filter((l) => l.sellerId === id), [allListings, id]);

  if (!member) {
    return <EmptyState icon="person-outline" title="Not found" body="This profile is no longer on RAYNO." />;
  }

  const mine = member.id === ME;
  const subtitle = member.trade ?? member.storeCategory ?? KIND_LABEL[member.kind];

  const chat = () => router.push(`/chat/${openConversation(member.id)}`);
  const call = () =>
    Alert.alert(
      'Calling is coming soon',
      'Phone calls will work once members sign up with verified numbers. For now, send a chat message.',
    );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: KIND_LABEL[member.kind] }} />
      <View style={styles.header}>
        <Avatar name={member.name} size={72} color={member.kind === 'store' ? colors.primary : colors.navy} />
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <AppText weight="semiBold" size={19} numberOfLines={2} style={styles.shrink}>
              {member.name}
            </AppText>
            {member.verified ? <VerifiedBadge size={18} /> : null}
          </View>
          <AppText size={13} color={colors.textMuted}>
            {subtitle}
          </AppText>
          <Rating rating={member.rating} reviews={member.reviews} />
        </View>
      </View>

      <View style={styles.facts}>
        <Fact icon="location-outline" text={member.location} />
        <Fact icon="calendar-outline" text={`On RAYNO since ${member.since}`} />
        {member.priceFrom ? <Fact icon="cash-outline" text={`From ${formatNLe(member.priceFrom)}`} /> : null}
        {member.availability ? (
          <Fact
            icon="time-outline"
            text={member.availability}
            color={member.availability === 'Busy' ? colors.red : colors.green}
          />
        ) : null}
        <Fact
          icon={member.verified ? 'shield-checkmark-outline' : 'shield-outline'}
          text={member.verified ? 'ID verified by RAYNO' : 'Not verified yet'}
        />
      </View>

      {member.about ? (
        <AppText size={14} style={styles.about}>
          {member.about}
        </AppText>
      ) : null}

      {!mine ? (
        <View style={styles.actions}>
          <Button label="Call" icon="call-outline" variant="secondary" onPress={call} style={styles.flex} />
          <Button
            label={member.kind === 'provider' ? 'Book / Chat' : 'Chat'}
            icon="chatbubble-ellipses-outline"
            onPress={chat}
            style={styles.flex}
          />
        </View>
      ) : null}

      <AppText weight="semiBold" size={17} style={styles.heading}>
        {member.kind === 'provider' ? 'Work & offers' : 'Products'} ({items.length})
      </AppText>
      {items.length ? (
        <ListingGrid items={items} />
      ) : (
        <AppText size={13} color={colors.textMuted}>
          Nothing listed yet.
        </AppText>
      )}
    </ScrollView>
  );
}

function Fact({
  icon,
  text,
  color = colors.text,
}: {
  icon: 'location-outline' | 'calendar-outline' | 'cash-outline' | 'time-outline' | 'shield-checkmark-outline' | 'shield-outline';
  text: string;
  color?: string;
}) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <AppText size={13} color={color}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  shrink: {
    flexShrink: 1,
  },
  facts: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
    gap: spacing.sm,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  about: {
    marginTop: spacing.lg,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  heading: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  flex: {
    flex: 1,
  },
});
