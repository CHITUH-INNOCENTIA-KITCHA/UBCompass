import { create } from 'zustand';
import { fetchRoomsByBuildingId, Room } from '@/services/rooms.service';

interface RoomsStore {
  rooms: Room[];
  currentBuildingRooms: Room[];
  isLoading: boolean;
  error: Error | null;
  fetchRoomsByBuildingId: (buildingId: string) => Promise<void>;
  setRooms: (rooms: Room[]) => void;
}

export const useRoomsStore = create<RoomsStore>((set) => ({
  rooms: [],
  currentBuildingRooms: [],
  isLoading: false,
  error: null,

  fetchRoomsByBuildingId: async (buildingId: string) => {
    set({ isLoading: true, error: null });
    try {
      const rooms = await fetchRoomsByBuildingId(buildingId);
      set({ currentBuildingRooms: rooms, isLoading: false });
    } catch (error) {
      console.error(`Failed to fetch rooms for building ${buildingId}:`, error);
      set({ error: error as Error, isLoading: false });
    }
  },

  setRooms: (rooms) => set({ rooms }),
}));
