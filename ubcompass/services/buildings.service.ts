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

// Fallback mock data while database is being set up
const MOCK_BUILDINGS: Building[] = [
  {
    id: 'fos',
    name: 'Faculty of Science',
    shortName: 'FOS',
    category: 'faculty',
    description: 'A central academic hub for science departments, laboratories, and lecture rooms.',
    openingHours: 'Mon - Fri, 7:30 AM - 6:00 PM',
    floors: 3,
    accessibleEntrance: true,
    hasIndoorMap: true,
    latitude: 4.1549,
    longitude: 9.2841,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
    highlights: ['Labs', 'Lecture halls', 'Ramp access'],
    nearby: ['Main Gate', 'Amphitheatre', 'Library'],
  },
  {
    id: 'fet',
    name: 'Faculty of Engineering & Technology',
    shortName: 'FET',
    category: 'faculty',
    description: 'Engineering workshops, project studios, and classrooms gathered in one busy zone.',
    openingHours: 'Mon - Fri, 8:00 AM - 6:30 PM',
    floors: 4,
    accessibleEntrance: true,
    hasIndoorMap: false,
    latitude: 4.1558,
    longitude: 9.2853,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Campus%20University%20of%20Buea.jpg',
    highlights: ['Innovation labs', 'Studios', 'Project rooms'],
    nearby: ['Admin Block', 'Science Block'],
  },
  {
    id: 'library',
    name: 'University Library',
    shortName: 'Library',
    category: 'facility',
    description: 'The library offers quiet reading areas, digital research access, and group study space.',
    openingHours: 'Mon - Sat, 8:00 AM - 8:00 PM',
    floors: 2,
    accessibleEntrance: true,
    hasIndoorMap: true,
    latitude: 4.1545,
    longitude: 9.286,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
    highlights: ['Study spaces', 'Digital access', 'Quiet zones'],
    nearby: ['FOS', 'Amphitheatre'],
  },
  {
    id: 'admin',
    name: 'Admin Block',
    shortName: 'Admin',
    category: 'admin',
    description: 'Central administration offices and student services hub.',
    openingHours: 'Mon - Fri, 8:00 AM - 5:00 PM',
    floors: 2,
    accessibleEntrance: false,
    hasIndoorMap: false,
    latitude: 4.1535,
    longitude: 9.2875,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Campus%20University%20of%20Buea.jpg',
    highlights: ['Offices', 'Student services'],
    nearby: ['Library', 'FET'],
  },
  {
    id: 'amphitheatre',
    name: 'Amphitheatre',
    shortName: 'Amphitheatre',
    category: 'facility',
    description: 'Large outdoor venue for lectures, seminars, and university events.',
    openingHours: 'Open access',
    floors: 1,
    accessibleEntrance: true,
    hasIndoorMap: false,
    latitude: 4.1555,
    longitude: 9.2845,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg',
    highlights: ['Events', 'Large groups'],
    nearby: ['FOS', 'Library'],
  },
];

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
    console.warn('Supabase unavailable, using mock data:', error);
    return MOCK_BUILDINGS;
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
    console.warn('Supabase unavailable, using mock data:', error);
    return MOCK_BUILDINGS.find((b) => b.id === id) || null;
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
    console.warn('Supabase unavailable, searching mock data:', error);
    // Fallback to mock data search
    const normalizedQuery = query.toLowerCase();
    return MOCK_BUILDINGS.filter((building) => {
      return (
        building.name.toLowerCase().includes(normalizedQuery) ||
        building.shortName.toLowerCase().includes(normalizedQuery) ||
        building.category.toLowerCase().includes(normalizedQuery) ||
        building.highlights.some((h) => h.toLowerCase().includes(normalizedQuery))
      );
    });
  }
}
