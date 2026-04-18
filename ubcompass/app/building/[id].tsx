import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Chip, Divider, Surface, Text } from 'react-native-paper';

import { campusBuildings } from '@/constants/mock-campus-data';
import { Colors } from '@/constants/theme';

export default function BuildingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const building = campusBuildings.find((item) => item.id === id) ?? campusBuildings[0];

  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Destination" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image source={{ uri: building.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <Chip style={styles.heroChip} textStyle={styles.heroChipText}>
                {building.category}
              </Chip>
              <Chip
                icon={building.accessibleEntrance ? 'wheelchair-accessibility' : 'stairs'}
                style={styles.heroChip}
                textStyle={styles.heroChipText}>
                {building.accessibleEntrance ? 'Accessible' : 'Standard access'}
              </Chip>
            </View>

            <Text variant="headlineMedium" style={styles.heroTitle}>
              {building.name}
            </Text>
            <Text variant="bodyLarge" style={styles.heroSubtitle}>
              {building.shortName} | {building.openingHours}
            </Text>

            <View style={styles.heroStatsRow}>
              <Surface style={styles.heroStatCard} elevation={0}>
                <Text variant="labelSmall" style={styles.heroStatLabel}>
                  Floors
                </Text>
                <Text variant="titleLarge" style={styles.heroStatValue}>
                  {building.floors}
                </Text>
              </Surface>
              <Surface style={styles.heroStatCard} elevation={0}>
                <Text variant="labelSmall" style={styles.heroStatLabel}>
                  Indoor map
                </Text>
                <Text variant="titleLarge" style={styles.heroStatValue}>
                  {building.hasIndoorMap ? 'Yes' : 'Soon'}
                </Text>
              </Surface>
            </View>
          </View>
        </View>

        <Surface style={styles.summaryCard} elevation={1}>
          <Text variant="titleMedium">About this place</Text>
          <Text variant="bodyLarge" style={styles.summaryCopy}>
            {building.description}
          </Text>

          <View style={styles.primaryActions}>
            <Button
              mode="contained"
              icon="directions"
              onPress={() =>
                router.push({
                  pathname: '/directions/[id]',
                  params: { id: building.id },
                })
              }
              style={styles.primaryActionButton}>
              Get Directions
            </Button>
            <Button
              mode="outlined"
              icon="floor-plan"
              onPress={() => router.push('/indoor')}
              disabled={!building.hasIndoorMap}
              style={styles.primaryActionButton}>
              View Indoor Map
            </Button>
          </View>
        </Surface>

        <View style={styles.twoColumnGrid}>
          <Surface style={styles.infoTile} elevation={1}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={22}
              color={Colors.brand.primary}
            />
            <Text variant="titleSmall" style={styles.infoTileTitle}>
              Opening Hours
            </Text>
            <Text variant="bodyMedium" style={styles.infoTileCopy}>
              {building.openingHours}
            </Text>
          </Surface>

          <Surface style={styles.infoTile} elevation={1}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={22}
              color={Colors.brand.primary}
            />
            <Text variant="titleSmall" style={styles.infoTileTitle}>
              Coordinates
            </Text>
            <Text variant="bodyMedium" style={styles.infoTileCopy}>
              {building.latitude}, {building.longitude}
            </Text>
          </Surface>
        </View>

        <Surface style={styles.sectionCard} elevation={1}>
          <Text variant="titleMedium">What you will find here</Text>
          <View style={styles.chipWrap}>
            {building.highlights.map((item) => (
              <Chip key={item} style={styles.highlightChip} icon="check-decagram-outline">
                {item}
              </Chip>
            ))}
          </View>
        </Surface>

        <Surface style={styles.sectionCard} elevation={1}>
          <Text variant="titleMedium">Nearby places</Text>
          <Text variant="bodyMedium" style={styles.sectionCopy}>
            Good next stops if you are planning a route around this area of campus.
          </Text>
          <View style={styles.nearbyList}>
            {building.nearby.map((place, index) => (
              <View key={place}>
                <View style={styles.nearbyRow}>
                  <View style={styles.nearbyIconWrap}>
                    <MaterialCommunityIcons
                      name="map-marker-radius-outline"
                      size={18}
                      color={Colors.brand.primary}
                    />
                  </View>
                  <View style={styles.nearbyCopy}>
                    <Text variant="titleSmall">{place}</Text>
                    <Text variant="bodySmall" style={styles.sectionCopy}>
                      Connected to this destination in the current campus preview flow.
                    </Text>
                  </View>
                </View>
                {index < building.nearby.length - 1 ? <Divider style={styles.divider} /> : null}
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  appbar: {
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  heroCard: {
    minHeight: 380,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: Colors.brand.primaryDark,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 42, 8, 0.5)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 22,
    paddingTop: 26,
  },
  heroTopRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 18,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    lineHeight: 24,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  heroStatCard: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatLabel: {
    color: 'rgba(255,255,255,0.82)',
  },
  heroStatValue: {
    marginTop: 6,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  summaryCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  summaryCopy: {
    color: Colors.brand.text,
    lineHeight: 25,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryActionButton: {
    borderRadius: 999,
  },
  twoColumnGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  infoTile: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  infoTileTitle: {
    color: Colors.brand.text,
    fontWeight: '700',
  },
  infoTileCopy: {
    color: Colors.brand.textMuted,
    lineHeight: 22,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  sectionCopy: {
    color: Colors.brand.textMuted,
    lineHeight: 22,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  highlightChip: {
    backgroundColor: '#EEF6EA',
  },
  nearbyList: {
    gap: 2,
  },
  nearbyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  nearbyIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDF6E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  nearbyCopy: {
    flex: 1,
    gap: 4,
  },
  divider: {
    backgroundColor: '#E6EEE2',
  },
});
