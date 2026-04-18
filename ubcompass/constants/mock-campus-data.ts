export type CampusCategory = 'faculty' | 'admin' | 'facility' | 'hostel';

export interface Building {
  id: string;
  name: string;
  shortName: string;
  category: CampusCategory;
  description: string;
  openingHours: string;
  floors: number;
  accessibleEntrance: boolean;
  hasIndoorMap: boolean;
  latitude: number;
  longitude: number;
  image: string;
  nearby: string[];
  highlights: string[];
}

export const campusBuildings: Building[] = [
  {
    id: 'fos',
    name: 'Faculty of Science',
    shortName: 'FOS',
    category: 'faculty',
    description:
      'A central academic hub for science departments, laboratories, and lecture rooms.',
    openingHours: 'Mon - Fri, 7:30 AM - 6:00 PM',
    floors: 3,
    accessibleEntrance: true,
    hasIndoorMap: true,
    latitude: 4.1549,
    longitude: 9.2841,
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80',
    nearby: ['Main Gate', 'Amphitheatre', 'Library'],
    highlights: ['Labs', 'Lecture halls', 'Ramp access'],
  },
  {
    id: 'fet',
    name: 'Faculty of Engineering & Technology',
    shortName: 'FET',
    category: 'faculty',
    description:
      'Engineering workshops, project studios, and classrooms gathered in one busy zone.',
    openingHours: 'Mon - Fri, 8:00 AM - 6:30 PM',
    floors: 4,
    accessibleEntrance: true,
    hasIndoorMap: false,
    latitude: 4.1558,
    longitude: 9.2853,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    nearby: ['Admin Block', 'Science Block'],
    highlights: ['Innovation labs', 'Studios', 'Project rooms'],
  },
  {
    id: 'library',
    name: 'University Library',
    shortName: 'Library',
    category: 'facility',
    description:
      'The library offers quiet reading areas, digital research access, and group study space.',
    openingHours: 'Mon - Sat, 8:00 AM - 8:00 PM',
    floors: 2,
    accessibleEntrance: true,
    hasIndoorMap: true,
    latitude: 4.1545,
    longitude: 9.286,
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    nearby: ['FSMS', 'Admin Block'],
    highlights: ['Study pods', 'Research desks', 'Accessible lift'],
  },
  {
    id: 'admin',
    name: 'Administration Block',
    shortName: 'Admin',
    category: 'admin',
    description:
      'Home to admissions, finance, and administrative offices serving students and staff.',
    openingHours: 'Mon - Fri, 8:00 AM - 5:00 PM',
    floors: 3,
    accessibleEntrance: false,
    hasIndoorMap: false,
    latitude: 4.154,
    longitude: 9.2855,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    nearby: ['Library', 'FET'],
    highlights: ['Student records', 'Finance office', 'Help desk'],
  },
  {
    id: 'sub',
    name: 'Student Union Building',
    shortName: 'SUB',
    category: 'facility',
    description:
      'A lively campus social center with student services, lounges, and meeting rooms.',
    openingHours: 'Daily, 8:00 AM - 9:00 PM',
    floors: 2,
    accessibleEntrance: true,
    hasIndoorMap: false,
    latitude: 4.1531,
    longitude: 9.2848,
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    nearby: ['Sports Complex', 'Main Gate'],
    highlights: ['Clubs', 'Cafeteria', 'Meeting rooms'],
  },
];

export const indoorPreviewFloors = [
  { label: 'G', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
];

export const recentQueries = ['Faculty of Science', 'Library', 'Student Union'];
