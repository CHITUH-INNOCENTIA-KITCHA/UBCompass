import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Appbar, Button, Chip, Portal, Searchbar, Snackbar, Surface, Text } from 'react-native-paper';

import { useBuildings } from '@/hooks/use-buildings';
import { useLocation } from '@/hooks/use-location';
import { useAppStore } from '@/store/app-store';
import { Colors } from '@/constants/theme';
import { getWalkingRoute, formatDistance, formatDuration, type Coordinate } from '@/utils/osm-routing';

const SHEET_EXPANDED_HEIGHT = 320;
const SHEET_COLLAPSED_HEIGHT = 92;
const SHEET_TRAVEL = SHEET_EXPANDED_HEIGHT - SHEET_COLLAPSED_HEIGHT;

// Default starting point when GPS is not available
const MAIN_GATE = { name: 'Main Gate', latitude: 4.1537, longitude: 9.2837 };

export default function DirectionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buildings: campusBuildings, isLoading } = useBuildings();
  const { location, errorMsg: locationError } = useLocation(false);
  const { accessibilityMode } = useAppStore();

  const mapRef = useRef<MapView | null>(null);
  const sheetOffset = useRef(new Animated.Value(0)).current;
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const destination = campusBuildings.find((building) => building.id === id) ?? campusBuildings[0];

  // Determine starting point - use GPS location if available, otherwise use Main Gate
  const startPoint = useMemo(() => {
    if (location) {
      return {
        name: 'Your Location',
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    return MAIN_GATE;
  }, [location]);

  // Fetch route from OSRM
  useEffect(() => {
    if (!destination) return;

    const fetchRoute = async () => {
      setIsLoadingRoute(true);
      try {
        const result = await getWalkingRoute(
          { latitude: startPoint.latitude, longitude: startPoint.longitude },
          { latitude: destination.latitude, longitude: destination.longitude }
        );

        if (result) {
          setRouteCoordinates(result.coordinates);
          setRouteDistance(result.distance);
          setRouteDuration(result.duration);
        } else {
          // Fallback to simple line if OSRM fails
          const midpoint = {
            latitude: (startPoint.latitude + destination.latitude) / 2 + 0.00025,
            longitude: (startPoint.longitude + destination.longitude) / 2 - 0.00012,
          };
          setRouteCoordinates([
            { latitude: startPoint.latitude, longitude: startPoint.longitude },
            midpoint,
            { latitude: destination.latitude, longitude: destination.longitude },
          ]);
          // Estimate distance
          const latDiff = destination.latitude - startPoint.latitude;
          const lonDiff = destination.longitude - startPoint.longitude;
          const approxMeters = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111000;
          setRouteDistance(approxMeters);
          setRouteDuration(approxMeters / 1.4);
          setSnackbarMessage('Using estimated route (offline mode)');
          setSnackbarVisible(true);
        }
      } catch (error) {
        console.error('Route fetch error:', error);
        setSnackbarMessage('Failed to fetch route');
        setSnackbarVisible(true);
      } finally {
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [destination?.id, startPoint.latitude, startPoint.longitude]);

  // Format display values
  const routeDistanceDisplay = useMemo(() => {
    if (routeDistance === null) return '-- km';
    return formatDistance(routeDistance);
  }, [routeDistance]);

  const routeDurationDisplay = useMemo(() => {
    if (routeDuration === null) return '-- min';
    return formatDuration(routeDuration);
  }, [routeDuration]);

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

  // Calculate map region to fit both points
  const routeRegion = useMemo(() => {
    return {
      latitude: (startPoint.latitude + destination.latitude) / 2,
      longitude: (startPoint.longitude + destination.longitude) / 2,
      latitudeDelta: Math.max(Math.abs(destination.latitude - startPoint.latitude) * 2.6, 0.0045),
      longitudeDelta: Math.max(Math.abs(destination.longitude - startPoint.longitude) * 2.6, 0.0045),
    };
  }, [startPoint, destination]);

  // Focus on user's location
  const focusOnUser = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
        500
      );
    } else {
      setSnackbarMessage('Location not available');
      setSnackbarVisible(true);
    }
  };

  if (isLoading && !destination) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

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
        {/* User location blue dot (if GPS available) */}
        {location && (
          <>
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={location.accuracy ?? 20}
              fillColor="rgba(66, 133, 244, 0.2)"
              strokeColor="rgba(66, 133, 244, 0.5)"
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title="You are here"
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.blueDot}>
                <View style={styles.blueDotInner} />
              </View>
            </Marker>
          </>
        )}

        {/* Starting point marker (Main Gate if no GPS) */}
        {!location && (
          <Marker
            coordinate={{ latitude: MAIN_GATE.latitude, longitude: MAIN_GATE.longitude }}
            title={MAIN_GATE.name}
            description="Starting point"
            pinColor={Colors.brand.accent}
          />
        )}

        {/* Destination marker */}
        <Marker
          coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
          title={destination.name}
          description={destination.description}
          pinColor={Colors.brand.route}
        />

        {/* Route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.brand.route}
            strokeWidth={5}
          />
        )}
      </MapView>

      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="Directions"
          subtitle={location ? 'From your location' : 'From Main Gate'}
        />
        <Appbar.Action icon="crosshairs-gps" onPress={focusOnUser} />
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
          {isLoadingRoute ? '...' : routeDurationDisplay}
        </Chip>
        <Chip icon="map-marker-distance" style={styles.floatingChip}>
          {isLoadingRoute ? '...' : routeDistanceDisplay}
        </Chip>
        {location && (
          <Chip icon="crosshairs-gps" style={[styles.floatingChip, styles.gpsChip]}>
            GPS
          </Chip>
        )}
        {accessibilityMode && (
          <Chip icon="wheelchair-accessibility" style={[styles.floatingChip, styles.accessibilityChip]}>
            Accessible
          </Chip>
        )}
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
                From {startPoint.name} | {isLoadingRoute ? 'Calculating...' : `Arrival in about ${routeDurationDisplay}`}
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
                {isLoadingRoute ? '...' : routeDistanceDisplay}
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
                {location
                  ? 'Start from your current location and head toward the campus.'
                  : `Start at ${MAIN_GATE.name} and head toward the campus core.`}
              </Text>
            </View>
            <View style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text variant="labelMedium" style={styles.stepBadgeText}>
                  2
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.stepText}>
                Follow the walking path toward {destination.shortName}.
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

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}>
          {snackbarMessage}
        </Snackbar>
      </Portal>
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
    flexWrap: 'wrap',
  },
  floatingChip: {
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  gpsChip: {
    backgroundColor: 'rgba(66, 133, 244, 0.15)',
  },
  accessibilityChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
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
  blueDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
