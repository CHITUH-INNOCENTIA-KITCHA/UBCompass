import { useRoomsStore } from '@/store/use-rooms-store';
import { Room } from '@/services/rooms.service';

interface UseRoomsReturn {
  rooms: Room[];
  currentBuildingRooms: Room[];
  isLoading: boolean;
  error: Error | null;
  fetchRoomsByBuildingId: (buildingId: string) => Promise<void>;
}

export function useRooms(): UseRoomsReturn {
  const { rooms, currentBuildingRooms, isLoading, error, fetchRoomsByBuildingId } = useRoomsStore();

  return {
    rooms,
    currentBuildingRooms,
    isLoading,
    error,
    fetchRoomsByBuildingId,
  };
}
