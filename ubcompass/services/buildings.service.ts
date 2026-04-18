import { supabase } from '@/lib/supabase';

export interface Building {
  id: string;
  name: string;
  shortName: string;
  category: 'faculty' | 'admin' | 'facility' | 'hostel';
  description: string;
  openingHours: string;
  floors: number;
  accessibleEntrance: boolean;
  hasIndoorMap: boolean;
  latitude: number;
  longitude: number;
  image: string;
  highlights: string[];
  nearby: string[];
}

export async function fetchAllBuildings(): Promise<Building[]> {
  try {
    const { data, error } = await supabase.from('buildings').select('*');

    if (error) throw error;

    return (data || []).map((building) => ({
      id: building.id,
      name: building.name,
      shortName: building.short_name,
      category: building.category,
      description: building.description,
      openingHours: building.opening_hours,
      floors: building.floors,
      accessibleEntrance: building.accessible_entrance,
      hasIndoorMap: building.has_indoor_map,
      latitude: building.latitude,
      longitude: building.longitude,
      image: building.image,
      highlights: building.highlights || [],
      nearby: building.nearby || [],
    })) as Building[];
  } catch (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }
}

export async function fetchBuildingById(id: string): Promise<Building | null> {
  try {
    const { data, error } = await supabase.from('buildings').select('*').eq('id', id).single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      shortName: data.short_name,
      category: data.category,
      description: data.description,
      openingHours: data.opening_hours,
      floors: data.floors,
      accessibleEntrance: data.accessible_entrance,
      hasIndoorMap: data.has_indoor_map,
      latitude: data.latitude,
      longitude: data.longitude,
      image: data.image,
      highlights: data.highlights || [],
      nearby: data.nearby || [],
    };
  } catch (error) {
    console.error(`Error fetching building ${id}:`, error);
    throw error;
  }
}

export async function searchBuildings(query: string): Promise<Building[]> {
  try {
    const normalizedQuery = query.toLowerCase();

    const { data, error } = await supabase.from('buildings').select('*');

    if (error) throw error;

    return ((data || []).filter((building) => {
      return (
        building.name.toLowerCase().includes(normalizedQuery) ||
        building.short_name.toLowerCase().includes(normalizedQuery) ||
        building.category.toLowerCase().includes(normalizedQuery) ||
        (building.highlights && building.highlights.some((h: string) => h.toLowerCase().includes(normalizedQuery)))
      );
    }) || []) as Building[];
  } catch (error) {
    console.error('Error searching buildings:', error);
    throw error;
  }
}
