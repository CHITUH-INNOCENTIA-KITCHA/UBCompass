import { supabase } from '@/lib/supabase';

export interface Room {
  id: string;
  building_id: string;
  name: string;
  room_number: string;
  floor: number;
  type: string;
  node_x: number;
  node_y: number;
  accessible: boolean;
}

export async function fetchRoomsByBuildingId(buildingId: string): Promise<Room[]> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('building_id', buildingId)
      .order('floor', { ascending: true });

    if (error) throw error;

    return (data || []) as Room[];
  } catch (error) {
    console.error(`Error fetching rooms for building ${buildingId}:`, error);
    throw error;
  }
}

export interface IndoorNode {
  id: string;
  building_id: string;
  room_id: string | null;
  node_x: number;
  node_y: number;
  floor: number;
  is_stairs: boolean;
  is_ramp: boolean;
  connections: string[];
}

export async function fetchIndoorGraph(buildingId: string): Promise<IndoorNode[]> {
  try {
    const { data, error } = await supabase
      .from('indoor_graph')
      .select('*')
      .eq('building_id', buildingId);

    if (error) throw error;

    return (data || []) as IndoorNode[];
  } catch (error) {
    console.error(`Error fetching indoor graph for building ${buildingId}:`, error);
    throw error;
  }
}
