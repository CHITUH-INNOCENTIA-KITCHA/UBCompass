import { create } from 'zustand';
import { fetchCampusImages, CampusImage } from '@/services/images.service';

interface ImagesStore {
  images: CampusImage[];
  isLoading: boolean;
  error: Error | null;
  fetchImages: () => Promise<void>;
  setImages: (images: CampusImage[]) => void;
}

export const useImagesStore = create<ImagesStore>((set) => ({
  images: [],
  isLoading: false,
  error: null,

  fetchImages: async () => {
    set({ isLoading: true, error: null });
    try {
      const images = await fetchCampusImages();
      set({ images, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch campus images:', error);
      set({ error: error as Error, isLoading: false });
    }
  },

  setImages: (images) => set({ images }),
}));
