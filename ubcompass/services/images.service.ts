import { supabase } from '@/lib/supabase';

export interface CampusImage {
  id: string;
  title: string;
  caption: string;
  image: string;
}

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
    console.error('Error fetching campus images:', error);
    throw error;
  }
}
