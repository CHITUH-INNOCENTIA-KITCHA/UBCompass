import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Divider, List, Searchbar, Surface, Text } from 'react-native-paper';

import { campusBuildings, recentQueries } from '@/constants/mock-campus-data';
import { Colors } from '@/constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return campusBuildings;
    }

    const normalizedQuery = query.toLowerCase();

    return campusBuildings.filter((building) => {
      return (
        building.name.toLowerCase().includes(normalizedQuery) ||
        building.shortName.toLowerCase().includes(normalizedQuery) ||
        building.highlights.some((item) => item.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [query]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Search campus places
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Browse buildings, services, and indoor-ready locations with a frontend-only mock dataset.
      </Text>

      <Searchbar
        placeholder="Search for FOS, Library, labs..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchbar}
        elevation={0}
      />

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Recent Searches</Text>
        <View style={styles.recentRow}>
          {recentQueries.map((item) => (
            <Chip key={item} icon="history" style={styles.recentChip} onPress={() => setQuery(item)}>
              {item}
            </Chip>
          ))}
        </View>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <View style={styles.resultHeader}>
          <Text variant="titleMedium">Results</Text>
          <Chip compact>{results.length} places</Chip>
        </View>

        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="map-search-outline"
              size={54}
              color={Colors.brand.textMuted}
            />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No places matched your search
            </Text>
            <Text variant="bodyMedium" style={styles.emptyCopy}>
              Try a building name, short name, or a feature like labs or cafeteria.
            </Text>
          </View>
        ) : (
          results.map((building, index) => (
            <View key={building.id}>
              <List.Item
                title={building.name}
                description={`${building.shortName} · ${building.category} · ${building.openingHours}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={building.hasIndoorMap ? 'floor-plan' : 'map-marker-outline'}
                    color={Colors.brand.primary}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() =>
                  router.push({
                    pathname: '/building/[id]',
                    params: { id: building.id },
                  })
                }
              />
              {index < results.length - 1 ? <Divider /> : null}
            </View>
          ))
        )}
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingTop: 32,
    paddingBottom: 120,
    gap: 18,
  },
  title: {
    color: Colors.brand.primaryDark,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.brand.textMuted,
    lineHeight: 24,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentChip: {
    backgroundColor: Colors.brand.primarySoft,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.brand.text,
    fontWeight: '700',
  },
  emptyCopy: {
    textAlign: 'center',
    color: Colors.brand.textMuted,
    lineHeight: 22,
    maxWidth: 260,
  },
});
