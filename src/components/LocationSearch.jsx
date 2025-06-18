import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';

const LocationSearch = () => {
  const inputRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Wait for the Google Maps API to load
    if (window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setSelectedLocation({
            lat,
            lng,
            name: place.formatted_address,
          });
        }
      });
    }
  }, []);

  const handleLocationInputChange = (e) => {
    const query = e.target.value;
    // Do something with the query if necessary (e.g., API calls)
  };

  return (
    <div>
      <Input
        ref={inputRef}
        placeholder="Search for a location"
        onChange={handleLocationInputChange}
        style={{ width: '100%', marginBottom: '16px' }}
      />
      {selectedLocation && (
        <div>
          <h4>Selected Location:</h4>
          <p>Name: {selectedLocation.name}</p>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
