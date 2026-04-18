import { useEffect } from 'react';
import { useImagesStore } from '@/store/use-images-store';
import { CampusImage } from '@/services/images.service';

interface UseImagesReturn {
  images: CampusImage[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useImages(): UseImagesReturn {
  const { images, isLoading, error, fetchImages } = useImagesStore();

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    isLoading,
    error,
    refetch: fetchImages,
  };
}
