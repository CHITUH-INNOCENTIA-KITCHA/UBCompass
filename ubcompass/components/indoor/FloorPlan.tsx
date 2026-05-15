import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import FOSFloorG, { FLOOR_G_ROOMS } from '@/assets/floorplans/fos-floor-g';
import FOSFloor1, { FLOOR_1_ROOMS } from '@/assets/floorplans/fos-floor-1';
import FOSFloor2, { FLOOR_2_ROOMS } from '@/assets/floorplans/fos-floor-2';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FLOOR_PLAN_WIDTH = SCREEN_WIDTH - 40;
const FLOOR_PLAN_HEIGHT = 260;

interface FloorPlanProps {
  buildingId: string;
  floor: number;
  selectedRoom?: string | null;
  destinationRoom?: string | null;
  routePath?: { x: number; y: number }[];
  onRoomPress?: (roomId: string) => void;
}

// Get rooms for a specific floor
export function getRoomsForFloor(buildingId: string, floor: number) {
  if (buildingId !== 'fos') return [];

  switch (floor) {
    case 0: return FLOOR_G_ROOMS;
    case 1: return FLOOR_1_ROOMS;
    case 2: return FLOOR_2_ROOMS;
    default: return [];
  }
}

// Get all rooms for a building
export function getAllRoomsForBuilding(buildingId: string) {
  if (buildingId !== 'fos') return [];

  return [
    ...FLOOR_G_ROOMS.map(r => ({ ...r, floor: 0 })),
    ...FLOOR_1_ROOMS.map(r => ({ ...r, floor: 1 })),
    ...FLOOR_2_ROOMS.map(r => ({ ...r, floor: 2 })),
  ];
}

export default function FloorPlan({
  buildingId,
  floor,
  selectedRoom,
  destinationRoom,
  routePath,
  onRoomPress,
}: FloorPlanProps) {
  // Gesture state
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, 0.5), 3);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Pan gesture for drag
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double tap to reset
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      savedScale.value = 1;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Render the appropriate floor plan
  const renderFloorPlan = useCallback(() => {
    if (buildingId !== 'fos') {
      return null; // No floor plan available for other buildings yet
    }

    const commonProps = {
      width: FLOOR_PLAN_WIDTH,
      height: FLOOR_PLAN_HEIGHT,
      selectedRoom,
      destinationRoom,
      routePath,
      onRoomPress,
    };

    switch (floor) {
      case 0:
        return <FOSFloorG {...commonProps} />;
      case 1:
        return <FOSFloor1 {...commonProps} />;
      case 2:
        return <FOSFloor2 {...commonProps} />;
      default:
        return <FOSFloorG {...commonProps} />;
    }
  }, [buildingId, floor, selectedRoom, destinationRoom, routePath, onRoomPress]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.floorPlanContainer, animatedStyle]}>
          {renderFloorPlan()}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    overflow: 'hidden',
  },
  floorPlanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
