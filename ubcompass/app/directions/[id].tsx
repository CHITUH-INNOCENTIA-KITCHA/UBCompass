import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Appbar, Button, Chip, Searchbar, Surface, Text } from 'react-native-paper';

import { useBuildings } from '@/hooks/use-buildings';
import { Colors } from '@/constants/theme';

const SHEET_EXPANDED_HEIGHT = 320;
const SHEET_COLLAPSED_HEIGHT = 92;
const SHEET_TRAVEL = SHEET_EXPANDED_HEIGHT - SHEET_COLLAPSED_HEIGHT;

export default function DirectionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buildings: campusBuildings, isLoading } = useBuildings();
  const mapRef = useRef<MapView | null>(null);
  const sheetOffset = useRef(new Animated.Value(0)).current;
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const destination = campusBuildings.find((building) => building.id === id) ?? campusBuildings[0];
  const mainGate = { name: 'Main Gate', latitude: 4.1537, longitude: 9.2837 };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 8,
      onPanResponderMove: (_, gestureState) => {
        const nextValue = isSheetCollapsed
          ? SHEET_TRAVEL + gestureState.dy
          : gestureState.dy;
        sheetOffset.setValue(Math.max(0, Math.min(SHEET_TRAVEL, nextValue)));
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = SHEET_TRAVEL / 3;

        if (isSheetCollapsed) {
          animateSheet(!(gestureState.dy < -threshold));
          return;
        }

        animateSheet(gestureState.dy > threshold);
      },
      onPanResponderTerminate: () => {
        animateSheet(isSheetCollapsed);
      },
    })
  ).current;

  const routeCoordinates = useMemo(() => {
    const midpoint = {
      latitude: (mainGate.latitude + destination.latitude) / 2 + 0.00025,
      longitude: (mainGate.longitude + destination.longitude) / 2 - 0.00012,
    };

    return [
      { latitude: mainGate.latitude, longitude: mainGate.longitude },
      midpoint,
      { latitude: destination.latitude, longitude: destination.longitude },
    ];
  }, [destination.latitude, destination.longitude, mainGate.latitude, mainGate.longitude]);

  const routeDistanceKm = useMemo(() => {
    const latDiff = destination.latitude - mainGate.latitude;
    const lonDiff = destination.longitude - mainGate.longitude;
    const approxKm = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111;

    return approxKm.toFixed(1);
  }, [destination.latitude, destination.longitude, mainGate.latitude, mainGate.longitude]);

  const routeDurationMin = useMemo(() => {
    const distance = Number(routeDistanceKm);
    return Math.max(4, Math.round(distance * 12));
  }, [routeDistanceKm]);

  if (isLoading && !destination) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  const animateSheet = (collapsed: boolean) => {
    setIsSheetCollapsed(collapsed);
    Animated.spring(sheetOffset, {
      toValue: collapsed ? SHEET_TRAVEL : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.8,
    }).start();
  };

  const routeRegion = {
    latitude: (mainGate.latitude + destination.latitude) / 2,
    longitude: (mainGate.longitude + destination.longitude) / 2,
    latitudeDelta: Math.max(Math.abs(destination.latitude - mainGate.latitude) * 2.6, 0.0045),
    longitudeDelta: Math.max(
      Math.abs(destination.longitude - mainGate.longitude) * 2.6,
      0.0045
    ),
  };

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={routeRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}>
        <Marker
          coordinate={{ latitude: mainGate.latitude, longitude: mainGate.longitude }}
          title={mainGate.name}
          description="Suggested starting point"
          pinColor={Colors.brand.accent}
        />
        <Marker
          coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
          title={destination.name}
          description={destination.description}
          pinColor={Colors.brand.route}
        />
        <Polyline coordinates={routeCoordinates} strokeColor={Colors.brand.route} strokeWidth={5} />
      </MapView>

      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Directions" subtitle="Walking route preview" />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchWrap}>
        <Searchbar
          placeholder="Search campus places"
          value={destination.name}
          editable={false}
          onPressIn={() => router.push('/search')}
          style={styles.searchbar}
          elevation={0}
        />
      </View>

      <View style={styles.floatingChips}>
        <Chip icon="walk" style={styles.floatingChip}>
          {routeDurationMin} min
        </Chip>
        <Chip icon="map-marker-distance" style={styles.floatingChip}>
          {routeDistanceKm} km
        </Chip>
      </View>

      <View style={styles.recenterWrap}>
        <Button
          mode="contained-tonal"
          icon="crosshairs-gps"
          onPress={() => mapRef.current?.animateToRegion(routeRegion, 500)}
          style={styles.recenterButton}>
          Recenter
        </Button>
      </View>

      {isSheetCollapsed ? (
        <View style={styles.startNavWrap}>
          <Button mode="contained" icon="navigation" style={styles.startNavButton}>
            Start Navigation
          </Button>
        </View>
      ) : null}

      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: sheetOffset }],
          },
        ]}>
        <Surface style={styles.bottomSheetSurface} elevation={3}>
          <Pressable
            style={styles.handlePressArea}
            onPress={() => animateSheet(!isSheetCollapsed)}
            {...panResponder.panHandlers}>
            <View style={styles.sheetHandle} />
            <Text variant="labelMedium" style={styles.handleLabel}>
              {isSheetCollapsed ? 'Pull up for details' : 'Pull down for fullscreen map'}
            </Text>
          </Pressable>

          <View style={styles.sheetTopRow}>
            <View style={styles.sheetTitleCopy}>
              <Text variant="headlineSmall">{destination.name}</Text>
              <Text variant="bodyMedium" style={styles.sheetSubtitle}>
                From {mainGate.name} | Arrival in about {routeDurationMin} min
              </Text>
            </View>
            <Chip compact style={styles.categoryChip}>
              {destination.shortName}
            </Chip>
          </View>

          <View style={styles.statRow}>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                Mode
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                Walk
              </Text>
            </Surface>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                Distance
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {routeDistanceKm} km
              </Text>
            </Surface>
            <Surface style={styles.statTile} elevation={0}>
              <Text variant="labelMedium" style={styles.statLabel}>
                Access
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {destination.accessibleEntrance ? 'Ramp' : 'Stairs'}
              </Text>
            </Surface>
          </View>

          <View style={styles.stepsList}>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text variant="labelMedium" style={styles.stepBadgeText}>
                  1
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.stepText}>
                Start at {mainGate.name} and head toward the campus core.
              </Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text variant="labelMedium" style={styles.stepBadgeText}>
                  2
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.stepText}>
                Follow the main walking corridor toward {destination.shortName}.
              </Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text variant="labelMedium" style={styles.stepBadgeText}>
                  3
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.stepText}>
                Arrive at {destination.name}.{' '}
                {destination.accessibleEntrance
                  ? 'Accessible entrance available.'
                  : 'Standard entrance ahead.'}
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              mode="contained"
              icon="information-outline"
              onPress={() =>
                router.push({
                  pathname: '/building/[id]',
                  params: { id: destination.id },
                })
              }>
              Place Details
            </Button>
            <Button mode="outlined" icon="map" onPress={() => router.replace('/')}>
              Campus Map
            </Button>
          </View>
        </Surface>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  appbar: {
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  searchWrap: {
    position: 'absolute',
    top: 92,
    left: 16,
    right: 16,
  },
  searchbar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  floatingChips: {
    position: 'absolute',
    top: 156,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  floatingChip: {
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  recenterWrap: {
    position: 'absolute',
    right: 16,
    bottom: 342,
  },
  recenterButton: {
    borderRadius: 999,
  },
  startNavWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 118,
  },
  startNavButton: {
    borderRadius: 999,
    paddingVertical: 6,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -SHEET_TRAVEL,
  },
  bottomSheetSurface: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  handlePressArea: {
    alignItems: 'center',
    gap: 8,
  },
  sheetHandle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D5DED1',
    alignSelf: 'center',
  },
  handleLabel: {
    color: Colors.brand.textMuted,
  },
  sheetTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  sheetTitleCopy: {
    flex: 1,
    gap: 4,
  },
  sheetSubtitle: {
    color: Colors.brand.textMuted,
    lineHeight: 22,
  },
  categoryChip: {
    backgroundColor: Colors.brand.primarySoft,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#F3F8F0',
  },
  statLabel: {
    color: Colors.brand.textMuted,
  },
  statValue: {
    marginTop: 4,
    color: Colors.brand.primaryDark,
    fontWeight: '700',
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF6EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: Colors.brand.primary,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: Colors.brand.text,
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
});
