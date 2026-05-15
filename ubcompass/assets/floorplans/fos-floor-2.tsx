import * as React from 'react';
import Svg, { Rect, Text, Path, G } from 'react-native-svg';

interface FOSFloor2Props {
  width?: number;
  height?: number;
  selectedRoom?: string | null;
  destinationRoom?: string | null;
  routePath?: { x: number; y: number }[];
  onRoomPress?: (roomId: string) => void;
}

// Room data for Floor 2
export const FLOOR_2_ROOMS = [
  { id: '2-301', name: 'Biology Lab', x: 20, y: 20, width: 120, height: 80, type: 'lab' },
  { id: '2-302', name: 'Research Lab', x: 160, y: 20, width: 120, height: 80, type: 'lab' },
  { id: '2-303', name: 'Seminar Room', x: 20, y: 120, width: 100, height: 60, type: 'lecture_hall' },
  { id: '2-304', name: 'Staff Room', x: 140, y: 120, width: 80, height: 60, type: 'office' },
  { id: '2-305', name: 'HOD Office', x: 240, y: 120, width: 40, height: 60, type: 'office' },
  { id: '2-toilet', name: 'Restroom', x: 20, y: 200, width: 50, height: 40, type: 'toilet' },
  { id: '2-stairs', name: 'Stairs', x: 240, y: 200, width: 40, height: 40, type: 'stairs' },
  { id: '2-ramp', name: 'Ramp', x: 180, y: 200, width: 40, height: 40, type: 'ramp' },
];

export default function FOSFloor2({
  width = 300,
  height = 260,
  selectedRoom,
  destinationRoom,
  routePath,
  onRoomPress,
}: FOSFloor2Props) {
  const getRoomColor = (roomId: string, type: string) => {
    if (roomId === selectedRoom) return '#4285F4';
    if (roomId === destinationRoom) return '#34A853';

    switch (type) {
      case 'lecture_hall': return '#E8F5E9';
      case 'lab': return '#FFF3E0';
      case 'office': return '#E3F2FD';
      case 'toilet': return '#FCE4EC';
      case 'stairs': return '#FFF9C4';
      case 'ramp': return '#C8E6C9';
      default: return '#F5F5F5';
    }
  };

  const getTextColor = (roomId: string) => {
    if (roomId === selectedRoom || roomId === destinationRoom) return '#FFFFFF';
    return '#333333';
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 300 260">
      {/* Building boundary */}
      <Rect
        x={0}
        y={0}
        width={300}
        height={260}
        fill="#FAFAFA"
        stroke="#006400"
        strokeWidth={3}
      />

      {/* Corridor */}
      <Rect x={0} y={180} width={300} height={20} fill="#E0E0E0" />
      <Text x={150} y={193} fontSize={10} fill="#757575" textAnchor="middle">
        Main Corridor
      </Text>

      {/* Rooms */}
      {FLOOR_2_ROOMS.map((room) => (
        <G key={room.id} onPress={() => onRoomPress?.(room.id)}>
          <Rect
            x={room.x}
            y={room.y}
            width={room.width}
            height={room.height}
            fill={getRoomColor(room.id, room.type)}
            stroke={room.id === selectedRoom || room.id === destinationRoom ? '#006400' : '#9E9E9E'}
            strokeWidth={room.id === selectedRoom || room.id === destinationRoom ? 2 : 1}
            rx={4}
          />
          <Text
            x={room.x + room.width / 2}
            y={room.y + room.height / 2 - 6}
            fontSize={room.width > 60 ? 11 : 9}
            fill={getTextColor(room.id)}
            textAnchor="middle"
            fontWeight="bold"
          >
            {room.name}
          </Text>
          <Text
            x={room.x + room.width / 2}
            y={room.y + room.height / 2 + 8}
            fontSize={9}
            fill={getTextColor(room.id)}
            textAnchor="middle"
          >
            {room.id.toUpperCase()}
          </Text>
        </G>
      ))}

      {/* Route path */}
      {routePath && routePath.length > 1 && (
        <Path
          d={`M ${routePath.map((p) => `${p.x},${p.y}`).join(' L ')}`}
          stroke="#F57C00"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="8,4"
        />
      )}

      {/* Route endpoints */}
      {routePath && routePath.length > 0 && (
        <>
          <Rect
            x={routePath[0].x - 6}
            y={routePath[0].y - 6}
            width={12}
            height={12}
            fill="#4285F4"
            rx={2}
          />
          <Rect
            x={routePath[routePath.length - 1].x - 6}
            y={routePath[routePath.length - 1].y - 6}
            width={12}
            height={12}
            fill="#34A853"
            rx={2}
          />
        </>
      )}

      {/* Floor label */}
      <Text x={290} y={250} fontSize={12} fill="#006400" textAnchor="end" fontWeight="bold">
        Floor 2
      </Text>
    </Svg>
  );
}
