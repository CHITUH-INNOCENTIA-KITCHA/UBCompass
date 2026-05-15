import axios from 'axios';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  maneuver: string;
}

export interface RouteResult {
  coordinates: Coordinate[];
  distance: number; // total distance in meters
  duration: number; // total duration in seconds
  steps: RouteStep[];
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1';

/**
 * Fetches a walking route between two coordinates using OSRM API
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @returns Route result with coordinates, distance, duration, and steps
 */
export async function getWalkingRoute(
  start: Coordinate,
  end: Coordinate
): Promise<RouteResult | null> {
  try {
    // OSRM expects coordinates as longitude,latitude
    const url = `${OSRM_BASE_URL}/foot/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;

    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    if (response.data.code !== 'Ok' || !response.data.routes?.length) {
      console.warn('OSRM route not found:', response.data.code);
      return null;
    }

    const route = response.data.routes[0];
    const geometry = route.geometry;

    // Convert GeoJSON coordinates [lng, lat] to our format { latitude, longitude }
    const coordinates: Coordinate[] = geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      })
    );

    // Extract turn-by-turn steps
    const steps: RouteStep[] = [];
    if (route.legs?.length) {
      for (const leg of route.legs) {
        if (leg.steps?.length) {
          for (const step of leg.steps) {
            steps.push({
              instruction: step.name || 'Continue',
              distance: step.distance || 0,
              duration: step.duration || 0,
              maneuver: step.maneuver?.type || 'straight',
            });
          }
        }
      }
    }

    return {
      coordinates,
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
      steps,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('OSRM request timed out');
      } else if (error.response) {
        console.error('OSRM API error:', error.response.status, error.response.data);
      } else {
        console.error('OSRM network error:', error.message);
      }
    } else {
      console.error('OSRM routing error:', error);
    }
    return null;
  }
}

/**
 * Calculates the straight-line distance between two coordinates using Haversine formula
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @returns Distance in meters
 */
export function calculateHaversineDistance(start: Coordinate, end: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (start.latitude * Math.PI) / 180;
  const phi2 = (end.latitude * Math.PI) / 180;
  const deltaPhi = ((end.latitude - start.latitude) * Math.PI) / 180;
  const deltaLambda = ((end.longitude - start.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Estimates walking time based on distance
 * @param distanceMeters Distance in meters
 * @param walkingSpeedKmh Walking speed in km/h (default: 5 km/h)
 * @returns Estimated duration in seconds
 */
export function estimateWalkingTime(distanceMeters: number, walkingSpeedKmh: number = 5): number {
  const walkingSpeedMs = (walkingSpeedKmh * 1000) / 3600; // Convert to m/s
  return distanceMeters / walkingSpeedMs;
}

/**
 * Formats distance for display
 * @param meters Distance in meters
 * @returns Formatted string (e.g., "150 m" or "1.2 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Formats duration for display
 * @param seconds Duration in seconds
 * @returns Formatted string (e.g., "2 min" or "1 hr 15 min")
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}
