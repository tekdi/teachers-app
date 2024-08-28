import { useState, useCallback } from 'react';

interface GeoLocation {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback(
    async (returnData: boolean = false): Promise<GeoLocation | null> => {
      const getPosition = () => {
        return new Promise<GeolocationPosition>((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej);
        });
      };

      try {
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser.');
        }

        const position = await getPosition();

        const data: GeoLocation = {
          latitude: position?.coords?.latitude ?? 0,
          longitude: position?.coords?.longitude ?? 0,
        };

        if (!returnData) {
          setLocation(data);
        }

        return data;
      } catch (err) {
        setError((err as Error).message);
        return null;
      }
    },
    []
  );

  return { location, error, getLocation };
};

export default useGeolocation;
