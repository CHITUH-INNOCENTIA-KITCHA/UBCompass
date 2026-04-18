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

export interface CampusImage {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export const campusImages: CampusImage[] = [
  {
    id: 'entrance',
    title: 'Morning approach to campus',
    caption: 'Main street into the University of Buea campus with the mountain skyline in view.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Morning%20View%20of%20the%20University%20of%20Buea%20Entrance%2001.jpg',
  },
  {
    id: 'main-campus',
    title: 'University of Buea campus',
    caption: 'A wide campus view used to ground the UBCompass home experience in the real place.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
  },
  {
    id: 'campus-b',
    title: 'Campus B and Health Sciences',
    caption: 'A recent photograph from the University of Buea Campus B / Health Sciences area.',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg',
  },
];

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
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
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
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Campus%20University%20of%20Buea.jpg',
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
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
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
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Morning%20View%20of%20the%20University%20of%20Buea%20Entrance%2001.jpg',
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
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg',
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
