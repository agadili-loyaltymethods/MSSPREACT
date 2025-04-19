
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks/useAppDispatch';
import { useLocationService } from '@/lib/hooks/useLocationService';
import { useToast } from '@/lib/hooks/useToast';
import { setLocation } from '@/lib/store/slices/locationSlice';

interface Location {
  name: string;
  number: string;
  ext: {
    operator?: string;
    hideInMSSP?: boolean;
  };
}

export function Locations() {
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const dispatch = useAppDispatch();
  const { getLocations } = useLocationService();
  const { showError } = useToast();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const locations = await getLocations();
      const filteredLocations = locations.filter(
        (location: Location) => !location.ext.hideInMSSP
      );
      setAllLocations(filteredLocations);
      setSelectedLocation(filteredLocations[0].name);
      dispatch(setLocation(filteredLocations[0].number));
    } catch (error: any) {
      showError(error?.error?.error || error?.message);
    }
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationName = event.target.value;
    setSelectedLocation(locationName);
    const location = allLocations.find(loc => loc.name === locationName);
    if (location) {
      dispatch(setLocation(location.number));
    }
  };

  if (!allLocations.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          distance
        </span>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {allLocations.map(location => (
            <option key={location.number} value={location.name}>
              {location.ext.operator && location.ext.operator !== 'PlayNow'
                ? `${location.ext.operator} - ${location.name}`
                : location.name}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  );
}
