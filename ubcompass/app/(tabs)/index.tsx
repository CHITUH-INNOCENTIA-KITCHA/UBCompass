import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  FAB,
  Searchbar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';

import { campusBuildings } from '@/constants/mock-campus-data';
import { Colors } from '@/constants/theme';

export default function MapScreen() {
  const theme = useTheme();
  const featuredBuildings = campusBuildings.slice(0, 3);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text variant="headlineLarge" style={styles.heroTitle}>
            Find your way around UB.
          </Text>
          <Text variant="bodyLarge" style={styles.heroSubtitle}>
            Start with key landmarks, plan accessible routes, and preview the campus before we
            connect live maps.
          </Text>
        </View>

        <Searchbar
          placeholder="Search buildings, rooms, or facilities"
          value=""
          editable={false}
          onPressIn={() => router.push('/search')}
          style={styles.searchbar}
          elevation={0}
        />

        <Surface style={styles.mapCard} elevation={1}>
          <View style={styles.mapHeader}>
            <View>
              <Text variant="titleLarge" style={styles.mapTitle}>
                Campus Preview
              </Text>
              <Text variant="bodyMedium" style={styles.mapCaption}>
                Frontend placeholder for the outdoor map experience
              </Text>
            </View>
            <Chip icon="walk" compact>
              Walk mode
            </Chip>
          </View>

          <View style={styles.mapMock}>
            <View style={[styles.mapBlob, styles.blobOne]} />
            <View style={[styles.mapBlob, styles.blobTwo]} />
            <View style={[styles.routeLine, { backgroundColor: Colors.brand.route }]} />
            {featuredBuildings.map((building, index) => (
              <Button
                key={building.id}
                mode="contained-tonal"
                compact
                style={[styles.mapPin, pinPositions[index]]}
                onPress={() =>
                  router.push({
                    pathname: '/building/[id]',
                    params: { id: building.id },
                  })
                }>
                {building.shortName}
              </Button>
            ))}
          </View>

          <View style={styles.quickActions}>
            <Button mode="contained" icon="crosshairs-gps">
              My Location
            </Button>
            <Button mode="outlined" icon="wheelchair-accessibility">
              Accessibility Mode
            </Button>
          </View>
        </Surface>

        <View style={styles.sectionHeader}>
          <Text variant="titleLarge">Popular Stops</Text>
          <Button compact onPress={() => router.push('/search')}>
            See all
          </Button>
        </View>

        {campusBuildings.map((building) => (
          <Card key={building.id} style={styles.buildingCard} mode="elevated">
            <Card.Cover source={{ uri: building.image }} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <View style={styles.cardTitleCopy}>
                  <Text variant="titleLarge">{building.name}</Text>
                  <Text variant="bodyMedium" style={styles.mutedText}>
                    {building.openingHours}
                  </Text>
                </View>
                <Chip compact style={styles.categoryChip}>
                  {building.category}
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.description}>
                {building.description}
              </Text>
              <View style={styles.highlightRow}>
                {building.highlights.map((item) => (
                  <Chip key={item} compact style={styles.highlightChip}>
                    {item}
                  </Chip>
                ))}
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                onPress={() =>
                  router.push({
                    pathname: '/building/[id]',
                    params: { id: building.id },
                  })
                }>
                Details
              </Button>
              <Button mode="contained" onPress={() => router.push('/indoor')}>
                Navigate
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon={() => <MaterialCommunityIcons name="map-marker-radius" size={24} color="#FFFFFF" />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/search')}
      />
    </View>
  );
}

const pinPositions = [
  { top: 48, left: 24 },
  { top: 96, right: 24 },
  { bottom: 36, left: 116 },
];

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 18,
  },
  hero: {
    marginTop: 24,
    gap: 10,
  },
  heroTitle: {
    color: Colors.brand.primaryDark,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: Colors.brand.textMuted,
    lineHeight: 24,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
  },
  mapCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  mapTitle: {
    color: Colors.brand.text,
    fontWeight: '700',
  },
  mapCaption: {
    color: Colors.brand.textMuted,
    marginTop: 4,
  },
  mapMock: {
    marginTop: 18,
    height: 240,
    borderRadius: 24,
    backgroundColor: Colors.brand.mapLand,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBlob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Colors.brand.mapWater,
    opacity: 0.85,
  },
  blobOne: {
    width: 220,
    height: 220,
    top: -30,
    right: -50,
  },
  blobTwo: {
    width: 180,
    height: 180,
    bottom: -60,
    left: -30,
  },
  routeLine: {
    position: 'absolute',
    width: 220,
    height: 10,
    borderRadius: 999,
    top: 112,
    left: 72,
    transform: [{ rotate: '-18deg' }],
  },
  mapPin: {
    position: 'absolute',
    borderRadius: 999,
  },
  quickActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  sectionHeader: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buildingCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    gap: 12,
    paddingTop: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  cardTitleCopy: {
    flex: 1,
    gap: 4,
  },
  categoryChip: {
    backgroundColor: Colors.brand.primarySoft,
  },
  mutedText: {
    color: Colors.brand.textMuted,
  },
  description: {
    color: Colors.brand.text,
    lineHeight: 22,
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  highlightChip: {
    backgroundColor: '#F2F7EF',
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
  },
});
