import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
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

import { useBuildings } from '@/hooks/use-buildings';
import { useImages } from '@/hooks/use-images';
import { Colors } from '@/constants/theme';

export default function MapScreen() {
  const theme = useTheme();
  const { buildings: campusBuildings, isLoading: buildingsLoading } = useBuildings();
  const { images: campusImages } = useImages();
  const featuredBuildings = campusBuildings.slice(0, 4);
  const heroImage = campusImages[0];
  const galleryImages = campusImages.slice(1);
  const [selectedMapBuildingId, setSelectedMapBuildingId] = useState(featuredBuildings[0]?.id);
  const mapRef = useRef<MapView | null>(null);
  const selectedMapBuilding =
    campusBuildings.find((building) => building.id === selectedMapBuildingId) ?? campusBuildings[0];
  const mainGate = { id: 'main-gate', name: 'Main Gate', latitude: 4.1537, longitude: 9.2837 };

  const campusRegion = {
    latitude: 4.1547,
    longitude: 9.2853,
    latitudeDelta: 0.0058,
    longitudeDelta: 0.0058,
  };

  const routeCoordinates = useMemo(() => {
    const midpoint = {
      latitude: (mainGate.latitude + selectedMapBuilding.latitude) / 2 + 0.00025,
      longitude: (mainGate.longitude + selectedMapBuilding.longitude) / 2 - 0.00012,
    };

    return [
      { latitude: mainGate.latitude, longitude: mainGate.longitude },
      midpoint,
      { latitude: selectedMapBuilding.latitude, longitude: selectedMapBuilding.longitude },
    ];
  }, [
    mainGate.latitude,
    mainGate.longitude,
    selectedMapBuilding.latitude,
    selectedMapBuilding.longitude,
  ]);

  const routeDistanceKm = useMemo(() => {
    const latDiff = selectedMapBuilding.latitude - mainGate.latitude;
    const lonDiff = selectedMapBuilding.longitude - mainGate.longitude;
    const approxKm = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111;

    return approxKm.toFixed(1);
  }, [
    mainGate.latitude,
    mainGate.longitude,
    selectedMapBuilding.latitude,
    selectedMapBuilding.longitude,
  ]);

  const routeDurationMin = useMemo(() => {
    const distance = Number(routeDistanceKm);
    return Math.max(4, Math.round(distance * 12));
  }, [routeDistanceKm]);

  const focusBuilding = (buildingId: string) => {
    const building = campusBuildings.find((item) => item.id === buildingId);
    if (!building) {
      return;
    }

    setSelectedMapBuildingId(buildingId);
    mapRef.current?.animateToRegion(
      {
        latitude: building.latitude,
        longitude: building.longitude,
        latitudeDelta: 0.0022,
        longitudeDelta: 0.0022,
      },
      500
    );
  };

  const focusCampus = () => {
    mapRef.current?.animateToRegion(campusRegion, 500);
  };

  return (
    <View style={styles.screen}>
      {buildingsLoading && campusBuildings.length === 0 ? (
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.brand.primary} />
          <Text style={{ marginTop: 12 }}>Loading campus data...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image source={{ uri: heroImage.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Chip icon="map-marker-radius" style={styles.heroChip} textStyle={styles.heroChipText}>
              University of Buea
            </Chip>
            <Text variant="headlineLarge" style={styles.heroTitle}>
              Navigate the real UB campus.
            </Text>
            <Text variant="bodyLarge" style={styles.heroSubtitle}>
              Explore landmarks, routes, and key faculties with visuals drawn from the university
              itself.
            </Text>
            <Text variant="bodySmall" style={styles.heroCaption}>
              {heroImage.caption}
            </Text>
          </View>
        </View>

        <Surface style={styles.mapCard} elevation={1}>
          <View style={styles.mapHeader}>
            <View>
              <Text variant="titleLarge" style={styles.mapTitle}>
                Campus Map
              </Text>
              <Text variant="bodyMedium" style={styles.mapCaption}>
                Live frontend preview using UB building coordinates and on-device map tiles
              </Text>
            </View>
            <Chip icon="map-legend" compact>
              Outdoor view
            </Chip>
          </View>

          <View style={styles.mapFrame}>
            <View style={styles.mapSearchWrap}>
              <Searchbar
                placeholder="Search buildings, rooms, or facilities"
                value={selectedMapBuilding.name}
                editable={false}
                onPressIn={() => router.push('/search')}
                style={styles.mapSearchbar}
                elevation={0}
              />
            </View>
            <MapView
              ref={mapRef}
              provider={PROVIDER_DEFAULT}
              style={styles.map}
              initialRegion={campusRegion}
              rotateEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}>
              {campusBuildings.map((building) => (
                <Marker
                  key={building.id}
                  coordinate={{
                    latitude: building.latitude,
                    longitude: building.longitude,
                  }}
                  title={building.name}
                  description={building.description}
                  pinColor={
                    building.id === selectedMapBuildingId
                      ? Colors.brand.route
                      : Colors.brand.primary
                  }
                  onPress={() => setSelectedMapBuildingId(building.id)}
                />
              ))}
              <Marker
                coordinate={{ latitude: mainGate.latitude, longitude: mainGate.longitude }}
                title={mainGate.name}
                description="Suggested entry point"
                pinColor={Colors.brand.accent}
              />
              <Polyline
                coordinates={routeCoordinates}
                strokeColor={Colors.brand.route}
                strokeWidth={4}
                lineDashPattern={[1, 0]}
              />
            </MapView>
            <View style={styles.mapOverlayTop}>
              <Chip icon="routes" compact style={styles.overlayChip}>
                Suggested walking corridor
              </Chip>
            </View>
            <View style={styles.mapOverlayBottom}>
              <View style={styles.overlayTopRow}>
                <View style={styles.overlayTitleCopy}>
                  <Text variant="titleMedium">{selectedMapBuilding.name}</Text>
                  <Text variant="bodySmall" style={styles.overlayCopy}>
                    {selectedMapBuilding.description}
                  </Text>
                </View>
              </View>
              <View style={styles.mapSelectorRow}>
                {featuredBuildings.map((building) => (
                  <Button
                    key={building.id}
                    compact
                    mode={building.id === selectedMapBuildingId ? 'contained' : 'contained-tonal'}
                    style={styles.selectorButton}
                    onPress={() => focusBuilding(building.id)}>
                    {building.shortName}
                  </Button>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.mapStatsRow}>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                From
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                Gate
              </Text>
            </Surface>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                Distance
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {routeDistanceKm} km
              </Text>
            </Surface>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                ETA
              </Text>
              <Text variant="headlineSmall" style={styles.statValue}>
                {routeDurationMin} min
              </Text>
            </Surface>
          </View>

          <View style={styles.quickActions}>
            <Button mode="contained" icon="crosshairs-gps" onPress={focusCampus}>
              Recenter
            </Button>
            <Button
              mode="contained-tonal"
              icon="directions"
              onPress={() =>
                router.push({
                  pathname: '/directions/[id]',
                  params: { id: selectedMapBuilding.id },
                })
              }>
              Get Directions
            </Button>
            <Button
              mode="outlined"
              icon="information-outline"
              onPress={() =>
                router.push({
                  pathname: '/building/[id]',
                  params: { id: selectedMapBuilding.id },
                })
              }>
              View Stop
            </Button>
            <Button
              mode="outlined"
              icon="wheelchair-accessibility">
              Accessibility Mode
            </Button>
          </View>
        </Surface>

        <View style={styles.sectionHeader}>
          <Text variant="titleLarge">Campus Glimpses</Text>
          <Chip compact icon="image-multiple">
            Real UB imagery
          </Chip>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryRow}>
          {galleryImages.map((item) => (
            <Card key={item.id} style={styles.galleryCard} mode="elevated">
              <Image source={{ uri: item.image }} style={styles.galleryImage} contentFit="cover" />
              <Card.Content style={styles.galleryContent}>
                <Text variant="titleMedium">{item.title}</Text>
                <Text variant="bodySmall" style={styles.galleryCaption}>
                  {item.caption}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text variant="titleLarge">Popular Stops</Text>
          <Button compact onPress={() => router.push('/search')}>
            See all
          </Button>
        </View>

        {campusBuildings.map((building) => (
          <Card key={building.id} style={styles.buildingCard} mode="elevated">
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
              <View style={styles.metaRow}>
                <Chip compact icon="office-building-outline" style={styles.metaChip}>
                  {building.floors} floors
                </Chip>
                <Chip
                  compact
                  icon={building.accessibleEntrance ? 'wheelchair-accessibility' : 'stairs'}
                  style={styles.metaChip}>
                  {building.accessibleEntrance ? 'Accessible' : 'Standard access'}
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
              <Button
                mode="contained"
                onPress={() =>
                  router.push({
                    pathname: '/directions/[id]',
                    params: { id: building.id },
                  })
                }>
                Navigate
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
      )}

      <FAB
        icon={() => <MaterialCommunityIcons name="map-marker-radius" size={24} color="#FFFFFF" />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push('/search')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 18,
  },
  heroCard: {
    marginTop: 24,
    minHeight: 360,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: Colors.brand.primaryDark,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 42, 8, 0.52)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
    paddingTop: 26,
  },
  heroChip: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 24,
    marginTop: 10,
  },
  heroCaption: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 14,
    lineHeight: 20,
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
  mapFrame: {
    marginTop: 18,
    height: 360,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  mapSearchWrap: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    zIndex: 2,
  },
  mapSearchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlayTop: {
    position: 'absolute',
    top: 74,
    left: 14,
  },
  overlayChip: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  mapOverlayBottom: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.94)',
    padding: 14,
    gap: 10,
  },
  overlayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  overlayTitleCopy: {
    flex: 1,
    gap: 4,
  },
  overlayCopy: {
    color: Colors.brand.textMuted,
    lineHeight: 20,
  },
  mapSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  selectorButton: {
    borderRadius: 999,
  },
  mapStatsRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F4F8F1',
  },
  statLabel: {
    color: Colors.brand.textMuted,
  },
  statValue: {
    marginTop: 6,
    color: Colors.brand.primaryDark,
    fontWeight: '800',
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
  galleryRow: {
    gap: 14,
    paddingRight: 6,
  },
  galleryCard: {
    width: 280,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  galleryImage: {
    width: '100%',
    height: 180,
  },
  galleryContent: {
    gap: 8,
    paddingTop: 16,
  },
  galleryCaption: {
    color: Colors.brand.textMuted,
    lineHeight: 20,
  },
  buildingCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    gap: 12,
    paddingTop: 18,
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    backgroundColor: '#F4F7F2',
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
