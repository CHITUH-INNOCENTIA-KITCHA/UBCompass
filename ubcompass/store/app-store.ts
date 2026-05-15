import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MapStyle = 'standard' | 'satellite' | 'highContrast';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface SelectedBuilding {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface AppState {
  // Accessibility & Navigation Preferences
  accessibilityMode: boolean;
  showBuildingLabels: boolean;
  autoCenterOnLocation: boolean;
  mapStyle: MapStyle;

  // Navigation State
  selectedBuilding: SelectedBuilding | null;
  activeRoute: Coordinate[] | null;
  routeDistance: number | null; // in meters
  routeDuration: number | null; // in seconds

  // Search
  recentSearches: string[];

  // Actions
  setAccessibilityMode: (enabled: boolean) => void;
  setShowBuildingLabels: (show: boolean) => void;
  setAutoCenterOnLocation: (autoCenter: boolean) => void;
  setMapStyle: (style: MapStyle) => void;
  setSelectedBuilding: (building: SelectedBuilding | null) => void;
  setActiveRoute: (route: Coordinate[] | null, distance?: number, duration?: number) => void;
  clearRoute: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Default values
      accessibilityMode: false,
      showBuildingLabels: true,
      autoCenterOnLocation: true,
      mapStyle: 'standard',
      selectedBuilding: null,
      activeRoute: null,
      routeDistance: null,
      routeDuration: null,
      recentSearches: [],

      // Actions
      setAccessibilityMode: (enabled) => set({ accessibilityMode: enabled }),

      setShowBuildingLabels: (show) => set({ showBuildingLabels: show }),

      setAutoCenterOnLocation: (autoCenter) => set({ autoCenterOnLocation: autoCenter }),

      setMapStyle: (style) => set({ mapStyle: style }),

      setSelectedBuilding: (building) => set({ selectedBuilding: building }),

      setActiveRoute: (route, distance, duration) =>
        set({
          activeRoute: route,
          routeDistance: distance ?? null,
          routeDuration: duration ?? null,
        }),

      clearRoute: () =>
        set({
          activeRoute: null,
          routeDistance: null,
          routeDuration: null,
        }),

      addRecentSearch: (query) => {
        const { recentSearches } = get();
        // Remove if already exists, add to front, keep max 5
        const filtered = recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
        const updated = [query, ...filtered].slice(0, 5);
        set({ recentSearches: updated });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'ubcompass-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist settings, not transient navigation state
      partialize: (state) => ({
        accessibilityMode: state.accessibilityMode,
        showBuildingLabels: state.showBuildingLabels,
        autoCenterOnLocation: state.autoCenterOnLocation,
        mapStyle: state.mapStyle,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
