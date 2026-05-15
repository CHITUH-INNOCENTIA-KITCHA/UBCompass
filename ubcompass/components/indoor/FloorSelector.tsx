import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { Colors } from '@/constants/theme';

interface FloorSelectorProps {
  floors: number[];
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
}

export default function FloorSelector({
  floors,
  selectedFloor,
  onFloorChange,
}: FloorSelectorProps) {
  const buttons = floors.map((floor) => ({
    value: floor.toString(),
    label: floor === 0 ? 'G' : floor.toString(),
    showSelectedCheck: false,
  }));

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={styles.label}>
        Select Floor
      </Text>
      <SegmentedButtons
        value={selectedFloor.toString()}
        onValueChange={(value) => onFloorChange(parseInt(value, 10))}
        buttons={buttons}
        style={styles.segmented}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: Colors.brand.textMuted,
  },
  segmented: {
    alignSelf: 'flex-start',
  },
});
