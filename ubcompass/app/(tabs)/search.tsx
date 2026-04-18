import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, Divider, Searchbar, Surface, Text } from 'react-native-paper';

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
        building.category.toLowerCase().includes(normalizedQuery) ||
        building.highlights.some((item) => item.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [query]);

  const featuredResult = results[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <MaterialCommunityIcons name="map-search-outline" size={28} color="#FFFFFF" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>
          Search the campus
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Find buildings, compare nearby options, and jump quickly into the places students use
          most.
        </Text>

        <Searchbar
          placeholder="Search FOS, library, labs..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchbar}
          elevation={0}
        />
      </View>

      <View style={styles.quickRow}>
        <Surface style={styles.quickTile} elevation={0}>
          <Text variant="labelMedium" style={styles.quickLabel}>
            Places
          </Text>
          <Text variant="headlineSmall" style={styles.quickValue}>
            {campusBuildings.length}
          </Text>
        </Surface>
        <Surface style={styles.quickTile} elevation={0}>
          <Text variant="labelMedium" style={styles.quickLabel}>
            Indoor ready
          </Text>
          <Text variant="headlineSmall" style={styles.quickValue}>
            {campusBuildings.filter((building) => building.hasIndoorMap).length}
          </Text>
        </Surface>
        <Surface style={styles.quickTile} elevation={0}>
          <Text variant="labelMedium" style={styles.quickLabel}>
            Results
          </Text>
          <Text variant="headlineSmall" style={styles.quickValue}>
            {results.length}
          </Text>
        </Surface>
      </View>

      <Surface style={styles.sectionCard} elevation={1}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Recent Searches</Text>
          {query ? (
            <Button compact onPress={() => setQuery('')}>
              Clear
            </Button>
          ) : null}
        </View>
        <View style={styles.recentRow}>
          {recentQueries.map((item) => (
            <Chip
              key={item}
              icon="history"
              style={styles.recentChip}
              onPress={() => setQuery(item)}>
              {item}
            </Chip>
          ))}
        </View>
      </Surface>

      {featuredResult ? (
        <View style={styles.featuredCard}>
          <Image source={{ uri: featuredResult.image }} style={styles.featuredImage} contentFit="cover" />
          <View style={styles.featuredCopy}>
            <Chip compact style={styles.categoryChip}>
              {featuredResult.category}
            </Chip>
            <Text variant="titleLarge">{featuredResult.name}</Text>
            <Text variant="bodyMedium" style={styles.featuredText}>
              {featuredResult.description}
            </Text>
            <View style={styles.featuredMetaRow}>
              <Chip compact icon="clock-outline" style={styles.metaChip}>
                {featuredResult.openingHours}
              </Chip>
              <Chip compact icon="office-building-outline" style={styles.metaChip}>
                {featuredResult.floors} floors
              </Chip>
            </View>
            <Button
              mode="contained"
              icon="arrow-right"
              onPress={() =>
                router.push({
                  pathname: '/building/[id]',
                  params: { id: featuredResult.id },
                })
              }>
              Open top result
            </Button>
          </View>
        </View>
      ) : null}

      <Surface style={styles.sectionCard} elevation={1}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Matches</Text>
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
              Try a building name, short name, or a feature like labs, offices, or cafeteria.
            </Text>
          </View>
        ) : (
          results.map((building, index) => (
            <View key={building.id}>
              <View style={styles.resultRow}>
                <View style={styles.resultIconWrap}>
                  <MaterialCommunityIcons
                    name={building.hasIndoorMap ? 'floor-plan' : 'map-marker-radius-outline'}
                    size={22}
                    color={Colors.brand.primary}
                  />
                </View>
                <View style={styles.resultCopy}>
                  <View style={styles.resultTitleRow}>
                    <Text variant="titleMedium" style={styles.resultTitleText}>
                      {building.name}
                    </Text>
                    <Chip compact style={styles.smallCategoryChip}>
                      {building.shortName}
                    </Chip>
                  </View>
                  <Text variant="bodySmall" style={styles.resultMeta}>
                    {building.category} | {building.openingHours}
                  </Text>
                  <Text variant="bodyMedium" style={styles.resultDescription}>
                    {building.description}
                  </Text>
                  <View style={styles.resultTags}>
                    {building.highlights.slice(0, 2).map((item) => (
                      <Chip key={item} compact style={styles.resultChip}>
                        {item}
                      </Chip>
                    ))}
                  </View>
                </View>
                <Button
                  compact
                  mode="text"
                  style={styles.resultAction}
                  onPress={() =>
                    router.push({
                      pathname: '/building/[id]',
                      params: { id: building.id },
                    })
                  }>
                  View
                </Button>
              </View>
              {index < results.length - 1 ? <Divider style={styles.divider} /> : null}
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
    paddingTop: 40,
    paddingBottom: 120,
    gap: 18,
  },
  heroCard: {
    borderRadius: 30,
    padding: 20,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#F4F8F1',
    borderRadius: 24,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickTile: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F2F7EF',
  },
  quickLabel: {
    color: Colors.brand.textMuted,
  },
  quickValue: {
    marginTop: 6,
    color: Colors.brand.primaryDark,
    fontWeight: '800',
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  recentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentChip: {
    backgroundColor: Colors.brand.primarySoft,
  },
  featuredCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredCopy: {
    padding: 18,
    gap: 12,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF6EA',
  },
  featuredText: {
    color: Colors.brand.textMuted,
    lineHeight: 22,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    backgroundColor: '#F6F8F4',
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
    maxWidth: 280,
  },
  resultRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  resultIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF6EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  resultTitleText: {
    flex: 1,
  },
  smallCategoryChip: {
    backgroundColor: '#F2F7EF',
  },
  resultMeta: {
    color: Colors.brand.textMuted,
  },
  resultDescription: {
    color: Colors.brand.text,
    lineHeight: 22,
  },
  resultTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resultChip: {
    backgroundColor: '#FFF2CE',
  },
  resultAction: {
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  divider: {
    backgroundColor: '#E6EEE2',
    marginVertical: 6,
  },
});
