import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Button,
  Chip,
  Menu,
  Portal,
  Snackbar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { useBuildings } from '@/hooks/use-buildings';
import { useAppStore } from '@/store/app-store';
import { Colors } from '@/constants/theme';
import FloorPlan, { getAllRoomsForBuilding, getRoomsForFloor } from '@/components/indoor/FloorPlan';
import FloorSelector from '@/components/indoor/FloorSelector';
import { buildGraphFromRooms, findShortestPath, getRoomCenter, type PathResult } from '@/utils/pathfinding';

export default function IndoorScreen() {
  const { buildings: campusBuildings, isLoading } = useBuildings();
  const { accessibilityMode } = useAppStore();

  const indoorBuildings = campusBuildings.filter((building) => building.hasIndoorMap);
  const [selectedBuildingId, setSelectedBuildingId] = useState(indoorBuildings[0]?.id ?? '');
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [originRoom, setOriginRoom] = useState('');
  const [destinationRoom, setDestinationRoom] = useState('');
  const [routePath, setRoutePath] = useState<{ x: number; y: number }[] | undefined>();
  const [routeResult, setRouteResult] = useState<PathResult | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [originMenuVisible, setOriginMenuVisible] = useState(false);
  const [destinationMenuVisible, setDestinationMenuVisible] = useState(false);

  const selectedBuilding =
    indoorBuildings.find((building) => building.id === selectedBuildingId) ?? indoorBuildings[0];

  // Get building ID for floor plan (convert to fos format)
  const floorPlanBuildingId = selectedBuilding?.shortName?.toLowerCase() === 'fos' ? 'fos' : selectedBuildingId;

  // Get available floors for the selected building
  const availableFloors = useMemo(() => {
    if (!selectedBuilding) return [0];
    return Array.from({ length: selectedBuilding.floors || 3 }, (_, i) => i);
  }, [selectedBuilding]);

  // Get rooms for the current building
  const allRooms = useMemo(() => getAllRoomsForBuilding(floorPlanBuildingId), [floorPlanBuildingId]);
  const currentFloorRooms = useMemo(() => getRoomsForFloor(floorPlanBuildingId, selectedFloor), [floorPlanBuildingId, selectedFloor]);

  // Build the navigation graph
  const indoorGraph = useMemo(() => {
    if (allRooms.length === 0) return null;
    return buildGraphFromRooms(allRooms);
  }, [allRooms]);

  // Find route when origin and destination are set
  const findRoute = useCallback(() => {
    if (!originRoom || !destinationRoom) {
      setSnackbarMessage('Please select both origin and destination rooms');
      setSnackbarVisible(true);
      return;
    }

    if (!indoorGraph) {
      setSnackbarMessage('Indoor map not available for this building');
      setSnackbarVisible(true);
      return;
    }

    const startNodeId = `node-${originRoom}`;
    const endNodeId = `node-${destinationRoom}`;

    const result = findShortestPath(indoorGraph, startNodeId, endNodeId, accessibilityMode);

    if (result) {
      setRouteResult(result);
      setRoutePath(result.coordinates);

      // Check if route includes floor change
      if (result.includesFloorChange) {
        const changeType = result.floorChangeType === 'stairs' ? 'stairs' : 'ramp';
        setSnackbarMessage(`Route includes floor change via ${changeType}`);
        setSnackbarVisible(true);
      }

      // Switch to the floor where the route starts
      const startRoom = allRooms.find(r => r.id === originRoom);
      if (startRoom) {
        setSelectedFloor(startRoom.floor);
      }
    } else {
      setSnackbarMessage(
        accessibilityMode
          ? 'No accessible route found (accessibility mode is ON)'
          : 'No route found between these rooms'
      );
      setSnackbarVisible(true);
      setRoutePath(undefined);
      setRouteResult(null);
    }
  }, [originRoom, destinationRoom, indoorGraph, accessibilityMode, allRooms]);

  // Handle room selection from floor plan
  const handleRoomPress = useCallback((roomId: string) => {
    if (!originRoom) {
      setOriginRoom(roomId);
      setSnackbarMessage(`Origin set: ${roomId}`);
      setSnackbarVisible(true);
    } else if (!destinationRoom) {
      setDestinationRoom(roomId);
      setSnackbarMessage(`Destination set: ${roomId}`);
      setSnackbarVisible(true);
    } else {
      // Reset and set new origin
      setOriginRoom(roomId);
      setDestinationRoom('');
      setRoutePath(undefined);
      setRouteResult(null);
      setSnackbarMessage(`New origin set: ${roomId}`);
      setSnackbarVisible(true);
    }
  }, [originRoom, destinationRoom]);

  // Swap origin and destination
  const swapRooms = () => {
    const temp = originRoom;
    setOriginRoom(destinationRoom);
    setDestinationRoom(temp);
    setRoutePath(undefined);
    setRouteResult(null);
  };

  // Clear route
  const clearRoute = () => {
    setOriginRoom('');
    setDestinationRoom('');
    setRoutePath(undefined);
    setRouteResult(null);
  };

  // Generate route steps from result
  const routeSteps = useMemo(() => {
    if (!routeResult || !allRooms.length) {
      return [
        'Select an origin room',
        'Select a destination room',
        'Tap "Find Route" to calculate',
      ];
    }

    const steps: string[] = [];
    const originRoomData = allRooms.find(r => r.id === originRoom);
    const destRoomData = allRooms.find(r => r.id === destinationRoom);

    if (originRoomData) {
      steps.push(`Start from ${originRoomData.name} (${originRoomData.id})`);
    }

    steps.push('Follow the main corridor');

    if (routeResult.includesFloorChange) {
      const changeType = routeResult.floorChangeType === 'stairs' ? 'stairs' : 'ramp';
      steps.push(`Take the ${changeType} to change floors`);
    }

    if (accessibilityMode) {
      steps.push('Using accessible route (avoiding stairs)');
    }

    if (destRoomData) {
      steps.push(`Arrive at ${destRoomData.name} (${destRoomData.id})`);
    }

    return steps;
  }, [routeResult, allRooms, originRoom, destinationRoom, accessibilityMode]);

  const floorLabel = selectedFloor === 0 ? 'Ground Floor' : `Floor ${selectedFloor}`;

  if (isLoading && indoorBuildings.length === 0) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
      </View>
    );
  }

  if (!selectedBuilding) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="titleMedium">No buildings with indoor maps available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Image source={{ uri: selectedBuilding.image }} style={styles.heroImage} contentFit="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Chip icon="floor-plan" style={styles.heroChip} textStyle={styles.heroChipText}>
            Indoor Navigation
          </Chip>
          <Text variant="headlineMedium" style={styles.title}>
            Explore inside {selectedBuilding.shortName}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Navigate room-to-room with interactive floor plans and accessible routing.
          </Text>
        </View>
      </View>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Choose a building</Text>
        <View style={styles.buildingSelector}>
          {indoorBuildings.map((building) => (
            <Chip
              key={building.id}
              selected={building.id === selectedBuildingId}
              onPress={() => {
                setSelectedBuildingId(building.id);
                clearRoute();
              }}
              style={building.id === selectedBuildingId ? styles.selectedChip : styles.chip}>
              {building.shortName}
            </Chip>
          ))}
        </View>
        {accessibilityMode && (
          <Chip icon="wheelchair-accessibility" style={styles.accessibilityChip}>
            Accessibility mode is ON - routes avoid stairs
          </Chip>
        )}
      </Surface>

      <View style={styles.statRow}>
        <Surface style={styles.statTile} elevation={0}>
          <Text variant="labelMedium" style={styles.statLabel}>
            Floors
          </Text>
          <Text variant="headlineSmall" style={styles.statValue}>
            {selectedBuilding.floors}
          </Text>
        </Surface>
        <Surface style={styles.statTile} elevation={0}>
          <Text variant="labelMedium" style={styles.statLabel}>
            Access
          </Text>
          <Text variant="headlineSmall" style={styles.statValue}>
            {selectedBuilding.accessibleEntrance ? 'Ramp' : 'Stairs'}
          </Text>
        </Surface>
        <Surface style={styles.statTile} elevation={0}>
          <Text variant="labelMedium" style={styles.statLabel}>
            Rooms
          </Text>
          <Text variant="headlineSmall" style={styles.statValue}>
            {allRooms.length}
          </Text>
        </Surface>
      </View>

      <Surface style={styles.sectionCard} elevation={1}>
        <FloorSelector
          floors={availableFloors}
          selectedFloor={selectedFloor}
          onFloorChange={setSelectedFloor}
        />

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text variant="titleLarge">{selectedBuilding.name}</Text>
              <Text variant="bodyMedium" style={styles.planCaption}>
                {floorLabel} - Tap rooms to select
              </Text>
            </View>
            <Chip compact icon="gesture-pinch" style={styles.planChip}>
              Pinch to zoom
            </Chip>
          </View>

          <View style={styles.floorPlanContainer}>
            <FloorPlan
              buildingId={floorPlanBuildingId}
              floor={selectedFloor}
              selectedRoom={originRoom}
              destinationRoom={destinationRoom}
              routePath={routePath}
              onRoomPress={handleRoomPress}
            />
          </View>
        </View>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Route Builder</Text>
        <Text variant="bodyMedium" style={styles.helperText}>
          Tap rooms on the floor plan or select from the list below.
        </Text>

        <Menu
          visible={originMenuVisible}
          onDismiss={() => setOriginMenuVisible(false)}
          anchor={
            <TextInput
              label="From room"
              mode="outlined"
              value={originRoom ? allRooms.find(r => r.id === originRoom)?.name || originRoom : ''}
              onFocus={() => setOriginMenuVisible(true)}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          }>
          {currentFloorRooms.map((room) => (
            <Menu.Item
              key={room.id}
              onPress={() => {
                setOriginRoom(room.id);
                setOriginMenuVisible(false);
              }}
              title={`${room.name} (${room.id})`}
            />
          ))}
        </Menu>

        <Menu
          visible={destinationMenuVisible}
          onDismiss={() => setDestinationMenuVisible(false)}
          anchor={
            <TextInput
              label="To room"
              mode="outlined"
              value={destinationRoom ? allRooms.find(r => r.id === destinationRoom)?.name || destinationRoom : ''}
              onFocus={() => setDestinationMenuVisible(true)}
              right={<TextInput.Icon icon="chevron-down" />}
            />
          }>
          {currentFloorRooms.map((room) => (
            <Menu.Item
              key={room.id}
              onPress={() => {
                setDestinationRoom(room.id);
                setDestinationMenuVisible(false);
              }}
              title={`${room.name} (${room.id})`}
            />
          ))}
        </Menu>

        <View style={styles.routeActionRow}>
          <Button mode="contained" icon="source-branch" onPress={findRoute}>
            Find Route
          </Button>
          <Button mode="outlined" icon="swap-horizontal" onPress={swapRooms}>
            Swap
          </Button>
          <Button mode="text" icon="close" onPress={clearRoute}>
            Clear
          </Button>
        </View>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <View style={styles.stepsHeader}>
          <Text variant="titleMedium">Route Steps</Text>
          {routeResult && (
            <Chip compact icon="map-marker-distance">
              {Math.round(routeResult.distance)} units
            </Chip>
          )}
        </View>
        <View style={styles.stepsList}>
          {routeSteps.map((step, index) => (
            <View key={`${step}-${index}`} style={styles.stepRow}>
              <View style={styles.stepNumberWrap}>
                <Text variant="labelMedium" style={styles.stepNumber}>
                  {index + 1}
                </Text>
              </View>
              <Text variant="bodyMedium" style={styles.stepCopy}>
                {step}
              </Text>
            </View>
          ))}
        </View>
      </Surface>

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
    minHeight: 280,
    borderRadius: 30,
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
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginBottom: 14,
  },
  heroChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginTop: 10,
  },
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  buildingSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#EFF5EB',
  },
  selectedChip: {
    backgroundColor: '#CFE6C8',
  },
  accessibilityChip: {
    backgroundColor: '#FFF3E0',
    alignSelf: 'flex-start',
  },
  helperText: {
    color: Colors.brand.textMuted,
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F2F7EF',
  },
  statLabel: {
    color: Colors.brand.textMuted,
  },
  statValue: {
    marginTop: 6,
    color: Colors.brand.primaryDark,
    fontWeight: '800',
  },
  planCard: {
    borderRadius: 24,
    backgroundColor: '#F5FAF2',
    padding: 16,
    gap: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  planCaption: {
    color: Colors.brand.textMuted,
    marginTop: 4,
  },
  planChip: {
    backgroundColor: '#EEF6EA',
  },
  floorPlanContainer: {
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
  },
  routeActionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  stepsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsList: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumberWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF6EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: Colors.brand.primary,
    fontWeight: '800',
  },
  stepCopy: {
    flex: 1,
    color: Colors.brand.text,
    lineHeight: 22,
    paddingTop: 4,
  },
});
