import { create } from 'zustand';
import { fetchAllBuildings, Building } from '@/services/buildings.service';

interface BuildingsStore {
  buildings: Building[];
  isLoading: boolean;
  error: Error | null;
  fetchBuildings: () => Promise<void>;
  setBuildings: (buildings: Building[]) => void;
}

export const useBuildingsStore = create<BuildingsStore>((set) => ({
  buildings: [],
  isLoading: false,
  error: null,

  fetchBuildings: async () => {
    set({ isLoading: true, error: null });
    try {
      const buildings = await fetchAllBuildings();
      set({ buildings, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  setBuildings: (buildings) => set({ buildings }),
}));
