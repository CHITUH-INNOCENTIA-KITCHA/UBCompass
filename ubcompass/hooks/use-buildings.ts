import { useEffect } from 'react';
import { useBuildingsStore } from '@/store/use-buildings-store';
import { Building } from '@/services/buildings.service';

interface UseBuildingsReturn {
  buildings: Building[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useBuildings(): UseBuildingsReturn {
  const { buildings, isLoading, error, fetchBuildings } = useBuildingsStore();

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  return {
    buildings,
    isLoading,
    error,
    refetch: fetchBuildings,
  };
}
