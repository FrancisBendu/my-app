import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { conversations } from '@/data/mock';
import { colors, spacing } from '@/lib/theme';

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppText weight="semiBold" size={22} style={styles.heading}>
        Messages
      </AppText>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}>
              <AppText weight="semiBold" size={15} color={colors.white}>
                {initials(item.name)}
              </AppText>
            </View>
            <View style={styles.body}>
              <View style={styles.topLine}>
                <AppText weight="semiBold" size={15} numberOfLines={1} style={styles.name}>
                  {item.name}
                </AppText>
                <AppText size={11} color={colors.textMuted}>
                  {item.time}
                </AppText>
              </View>
              <View style={styles.topLine}>
                <AppText size={13} color={colors.textMuted} numberOfLines={1} style={styles.name}>
                  {item.lastMessage}
                </AppText>
                {item.unread > 0 ? (
                  <View style={styles.badge}>
                    <AppText weight="semiBold" size={11} color={colors.white}>
                      {item.unread}
                    </AppText>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  heading: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  list: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
