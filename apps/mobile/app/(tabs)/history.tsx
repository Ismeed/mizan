import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { useHistoryStore, CalculationType, HistoryEntry } from '../../src/stores/history.store';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing } from '../../src/constants/spacing';

type FilterType = 'all' | CalculationType;

export default function HistoryTab() {
  const router = useRouter();
  const { entries, load, remove, isLoaded } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this calculation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove(id) }
      ]
    );
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Type filter
      if (filter !== 'all' && entry.type !== filter) return false;
      
      // Search text
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const dateStr = new Date(entry.date).toLocaleDateString().toLowerCase();
        
        if (entry.type === 'zakat') {
          const cats = entry.categories?.join(', ').toLowerCase() || '';
          if (!cats.includes(query) && !dateStr.includes(query) && !entry.type.includes(query)) return false;
        } else {
          if (!dateStr.includes(query) && !entry.type.includes(query)) return false;
        }
      }
      
      return true;
    });
  }, [entries, filter, searchQuery]);

  const renderItem = ({ item }: { item: HistoryEntry }) => {
    const isZakat = item.type === 'zakat';
    const dateStr = new Date(item.date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/history/${item.id}`)}
        onLongPress={() => confirmDelete(item.id)}
        delayLongPress={500}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgeContainer}>
            <Text style={[styles.badgeText, { color: isZakat ? colors.secondary : colors.success }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.dateText}>{dateStr}</Text>
          <Ionicons name="document-text-outline" size={16} color={colors.textSecondary} style={{marginLeft: 'auto'}} />
        </View>

        <View style={styles.cardBody}>
          {isZakat ? (
            <>
              <Text style={styles.subtitleText} numberOfLines={1}>
                {item.categories?.join(', ')}
              </Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  Nisab: {item.nisabMet ? '✓' : '✗'}
                </Text>
                <Text style={styles.summaryTextBold}>
                  Total Zakat: {item.currency} {item.totalZakat?.toLocaleString()}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.subtitleText}>
                {item.heirCount} Heirs · {item.madhhab}
              </Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTextBold}>
                  Net Estate: {item.netEstate?.toLocaleString()}
                </Text>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="time-outline" size={64} color={colors.textMuted} />
      <Text style={styles.emptyText}>No calculations yet</Text>
      <Text style={styles.emptySubtext}>Your saved zakat and inheritance calculations will appear here.</Text>
    </View>
  );

  return (
    <SafeScreen withBottomTabBar edges={['top', 'left', 'right']}>
      <Header title="Calculation History" showBack={false} />
      
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search history..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterContainer}>
          {(['all', 'zakat', 'inheritance'] as FilterType[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={isLoaded ? renderEmpty : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    height: 40,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontFamily: (typography as any).bodyMedium || 'System',
    fontSize: 12,
  },
  filterTextActive: {
    color: colors.white,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'column',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingRight: spacing.lg,
  },
  badgeContainer: {
    marginRight: spacing.sm,
  },
  badgeText: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 12,
  },
  dateText: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardBody: {
    paddingRight: spacing.lg,
  },
  subtitleText: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryText: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryTextBold: {
    fontFamily: (typography as any).bodyBold || 'System',
    fontSize: 14,
    color: colors.textPrimary,
  },
  chevron: {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    marginTop: -10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontFamily: (typography as any).headingMedium || 'System',
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontFamily: (typography as any).bodyRegular || 'System',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
