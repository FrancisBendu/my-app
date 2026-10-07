import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { notifications } from '@/data/mock';
import { timeAgo } from '@/lib/format';
import { colors, radius, spacing } from '@/lib/theme';

export default function NotificationsScreen() {
  return (
    <FlatList
      style={styles.screen}
      data={notifications}
      keyExtractor={(n) => n.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.icon}>
            <Ionicons name={item.icon} size={20} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <AppText weight="semiBold" size={14}>
              {item.title}
            </AppText>
            <AppText size={13} color={colors.textMuted}>
              {item.body}
            </AppText>
            <AppText size={11} color={colors.textMuted} style={styles.time}>
              {timeAgo(item.at)}
            </AppText>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.lightGrey,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  time: {
    marginTop: 4,
  },
});
