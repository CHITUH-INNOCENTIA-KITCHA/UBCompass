import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Button,
  Chip,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { useBuildings } from '@/hooks/use-buildings';
import { Colors } from '@/constants/theme';

export default function IndoorScreen() {
  const { buildings: campusBuildings, isLoading } = useBuildings();
  const indoorPreviewFloors = [
    { value: '0', label: 'Ground' },
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
  ];
  const indoorBuildings = campusBuildings.filter((building) => building.hasIndoorMap);
  const [selectedBuildingId, setSelectedBuildingId] = useState(indoorBuildings[0]?.id ?? '');
  const [selectedFloor, setSelectedFloor] = useState('0');
  const [origin, setOrigin] = useState('Entrance');
  const [destination, setDestination] = useState('Lab 2');

  const selectedBuilding =
    indoorBuildings.find((building) => building.id === selectedBuildingId) ?? indoorBuildings[0];

  const floorLabel = selectedFloor === '0' ? 'Ground Floor' : `Floor ${selectedFloor}`;

  const routeSteps = useMemo(
    () => [
      `Start from ${origin}`,
      'Follow the main corridor',
      selectedBuilding.accessibleEntrance
        ? 'Use the accessible passage at the junction'
        : 'Continue past the central stairs',
      `Arrive at ${destination}`,
    ],
    [destination, origin, selectedBuilding.accessibleEntrance]
  );

  if (isLoading && indoorBuildings.length === 0) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.brand.primary} />
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
            Preview room-to-room flow with a mock indoor route before we connect the full floor
            graph.
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
              onPress={() => setSelectedBuildingId(building.id)}
              style={building.id === selectedBuildingId ? styles.selectedChip : styles.chip}>
              {building.shortName}
            </Chip>
          ))}
        </View>
        <Text variant="bodyMedium" style={styles.helperText}>
          {selectedBuilding.name} currently has the strongest indoor preview setup in this
          prototype.
        </Text>
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
            View
          </Text>
          <Text variant="headlineSmall" style={styles.statValue}>
            {floorLabel}
          </Text>
        </Surface>
      </View>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Floor Selector</Text>
        <SegmentedButtons
          value={selectedFloor}
          onValueChange={setSelectedFloor}
          buttons={indoorPreviewFloors}
        />

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text variant="titleLarge">{selectedBuilding.name}</Text>
              <Text variant="bodyMedium" style={styles.planCaption}>
                {floorLabel} preview
              </Text>
            </View>
            <Chip compact icon="source-branch" style={styles.planChip}>
              Demo route
            </Chip>
          </View>

          <View style={styles.floorPlanMock}>
            <View style={[styles.roomBox, styles.roomA]}>
              <Text variant="labelLarge">Entrance</Text>
            </View>
            <View style={[styles.roomBox, styles.roomB]}>
              <Text variant="labelLarge">Room B</Text>
            </View>
            <View style={[styles.roomBox, styles.roomC]}>
              <Text variant="labelLarge">Lab 2</Text>
            </View>
            <View style={styles.corridor} />
            <View style={styles.routePreview} />
            <View style={styles.routeDotStart} />
            <View style={styles.routeDotEnd} />
          </View>
        </View>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Route Builder</Text>
        <Text variant="bodyMedium" style={styles.helperText}>
          Set your origin and destination to preview how indoor directions will feel in the final
          app.
        </Text>
        <TextInput label="From room" mode="outlined" value={origin} onChangeText={setOrigin} />
        <TextInput
          label="To room"
          mode="outlined"
          value={destination}
          onChangeText={setDestination}
        />
        <View style={styles.routeActionRow}>
          <Button mode="contained" icon="source-branch">
            Find Route
          </Button>
          <Button mode="outlined" icon="swap-horizontal" onPress={() => {
            const currentOrigin = origin;
            setOrigin(destination);
            setDestination(currentOrigin);
          }}>
            Swap
          </Button>
        </View>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Route Steps</Text>
        <View style={styles.stepsList}>
          {routeSteps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
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
  floorPlanMock: {
    marginTop: 2,
    height: 280,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  roomBox: {
    position: 'absolute',
    backgroundColor: '#E7F3E2',
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    borderRadius: 18,
    padding: 10,
  },
  roomA: {
    top: 16,
    left: 16,
    width: 130,
    height: 84,
  },
  roomB: {
    top: 16,
    right: 16,
    width: 120,
    height: 84,
  },
  roomC: {
    bottom: 18,
    right: 22,
    width: 144,
    height: 92,
    backgroundColor: '#D6F0CC',
  },
  corridor: {
    position: 'absolute',
    top: 112,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: '#F3F3F3',
  },
  routePreview: {
    position: 'absolute',
    left: 76,
    top: 142,
    width: 170,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.brand.route,
    transform: [{ rotate: '28deg' }],
  },
  routeDotStart: {
    position: 'absolute',
    left: 74,
    top: 136,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.brand.primary,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  routeDotEnd: {
    position: 'absolute',
    right: 70,
    bottom: 80,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.brand.route,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  routeActionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
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
