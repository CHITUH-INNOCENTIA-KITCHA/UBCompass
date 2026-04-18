import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

import { campusBuildings, indoorPreviewFloors } from '@/constants/mock-campus-data';
import { Colors } from '@/constants/theme';

export default function IndoorScreen() {
  const indoorBuildings = campusBuildings.filter((building) => building.hasIndoorMap);
  const [selectedBuildingId, setSelectedBuildingId] = useState(indoorBuildings[0]?.id ?? '');
  const [selectedFloor, setSelectedFloor] = useState('0');
  const [origin, setOrigin] = useState('Entrance');
  const [destination, setDestination] = useState('Lab 2');

  const selectedBuilding =
    indoorBuildings.find((building) => building.id === selectedBuildingId) ?? indoorBuildings[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.title}>
        Indoor Navigation
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Preview the floor-plan flow and route form while we keep room data mocked locally.
      </Text>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Select a building</Text>
        <View style={styles.chipRow}>
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
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Floor</Text>
        <SegmentedButtons
          value={selectedFloor}
          onValueChange={setSelectedFloor}
          buttons={indoorPreviewFloors}
        />

        <Card style={styles.planCard} mode="contained">
          <Card.Content style={styles.planContent}>
            <Text variant="titleLarge">{selectedBuilding?.name}</Text>
            <Text variant="bodyMedium" style={styles.planCaption}>
              Floor {selectedFloor === '0' ? 'Ground' : selectedFloor} preview
            </Text>
            <View style={styles.floorPlanMock}>
              <View style={[styles.roomBox, styles.roomA]}>
                <Text variant="labelLarge">Room A</Text>
              </View>
              <View style={[styles.roomBox, styles.roomB]}>
                <Text variant="labelLarge">Room B</Text>
              </View>
              <View style={[styles.roomBox, styles.roomC]}>
                <Text variant="labelLarge">Lab 2</Text>
              </View>
              <View style={styles.corridor} />
              <View style={styles.routePreview} />
            </View>
          </Card.Content>
        </Card>
      </Surface>

      <Surface style={styles.sectionCard} elevation={1}>
        <Text variant="titleMedium">Route preview</Text>
        <TextInput label="From room" mode="outlined" value={origin} onChangeText={setOrigin} />
        <TextInput
          label="To room"
          mode="outlined"
          value={destination}
          onChangeText={setDestination}
        />
        <Button mode="contained" icon="source-branch" style={styles.routeButton}>
          Find Route
        </Button>
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
  sectionCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  chipRow: {
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
  planCard: {
    backgroundColor: '#F5FAF2',
    borderRadius: 24,
  },
  planContent: {
    gap: 8,
  },
  planCaption: {
    color: Colors.brand.textMuted,
  },
  floorPlanMock: {
    marginTop: 8,
    height: 260,
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
    width: 120,
    height: 80,
  },
  roomB: {
    top: 16,
    right: 16,
    width: 120,
    height: 80,
  },
  roomC: {
    bottom: 18,
    right: 22,
    width: 140,
    height: 86,
    backgroundColor: '#D6F0CC',
  },
  corridor: {
    position: 'absolute',
    top: 104,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#F3F3F3',
  },
  routePreview: {
    position: 'absolute',
    left: 84,
    top: 120,
    width: 150,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.brand.route,
    transform: [{ rotate: '32deg' }],
  },
  routeButton: {
    marginTop: 4,
  },
});
