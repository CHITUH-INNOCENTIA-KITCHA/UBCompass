import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
}

interface UseLocationReturn {
  location: LocationData | null;
  errorMsg: string | null;
  isLoading: boolean;
  permissionStatus: Location.PermissionStatus | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(enableTracking: boolean = true): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setErrorMsg('Location permission denied. Enable it in Settings for navigation.');
        return false;
      }

      setErrorMsg(null);
      return true;
    } catch (error) {
      setErrorMsg('Failed to request location permission.');
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        heading: currentLocation.coords.heading,
      });
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Failed to get current location.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const setupLocation = async () => {
      setIsLoading(true);

      // Check current permission status
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        // Request permission if not granted
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return;
        }
      }

      try {
        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          accuracy: initialLocation.coords.accuracy,
          heading: initialLocation.coords.heading,
        });
        setErrorMsg(null);

        // Subscribe to location updates if tracking is enabled
        if (enableTracking) {
          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 5000, // Update every 5 seconds
              distanceInterval: 5, // Or when moved 5 meters
            },
            (newLocation) => {
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                accuracy: newLocation.coords.accuracy,
                heading: newLocation.coords.heading,
              });
            }
          );
        }
      } catch (error) {
        setErrorMsg('Unable to get location. Please check your GPS settings.');
      } finally {
        setIsLoading(false);
      }
    };

    setupLocation();

    // Cleanup subscription on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [enableTracking, requestPermission]);

  return {
    location,
    errorMsg,
    isLoading,
    permissionStatus,
    requestPermission,
    refreshLocation,
  };
}
