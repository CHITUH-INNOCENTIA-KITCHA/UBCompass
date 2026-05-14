import { supabase } from '@/lib/supabase';

export interface CampusImage {
  id: string;
  title: string;
  caption: string;
  image: string;
}

// Fallback mock data
const MOCK_IMAGES: CampusImage[] = [
  {
    id: 'entrance',
    title: 'Morning approach to campus',
    caption: 'Main street into the University of Buea campus with the mountain skyline in view.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Morning%20View%20of%20the%20University%20of%20Buea%20Entrance%2001.jpg',
  },
  {
    id: 'main-campus',
    title: 'University of Buea campus',
    caption: 'A wide campus view used to ground the UBCompass home experience in the real place.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20campus.jpg',
  },
  {
    id: 'campus-b',
    title: 'Campus B and Health Sciences',
    caption: 'A recent photograph from the University of Buea Campus B / Health Sciences area.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/University%20of%20Buea%20Campus%20B.jpg',
  },
];

export async function fetchCampusImages(): Promise<CampusImage[]> {
  try {
    const { data, error } = await supabase.from('images').select('*').order('id', { ascending: true });

    if (error) throw error;

    return (data || []).map((image) => ({
      id: image.id,
      title: image.title,
      caption: image.caption,
      image: image.image,
    })) as CampusImage[];
  } catch (error) {
    console.warn('Supabase unavailable, using mock images:', error);
    return MOCK_IMAGES;
  }
}
