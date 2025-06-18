import { useEffect, useRef, useState } from 'react';

const ShopLocationAutocomplete = ({ onSelect, value, onChange }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchPlaces = async (inputValue) => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/places/autocomplete/json?input=${encodeURIComponent(inputValue)}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
        console.warn('API response status:', data.status);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    onChange(e); // Call the parent's onChange

    // Debounce API calls
    const timeoutId = setTimeout(() => {
      fetchPlaces(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = async (suggestion) => {
    onChange({ target: { value: suggestion.description } });
    setSuggestions([]);

    try {
      // Fetch place details to get coordinates
      const response = await fetch(
        `/api/places/details/json?place_id=${suggestion.place_id}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`
      );
      const data = await response.json();

      if (data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        onSelect({
          address: suggestion.description,
          coordinates: [lat, lng]
        });
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div className="relative" ref={componentRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter your shop location"
        style={{
          width: "100%",
          height: "44px",
          background: "transparent",
          border: "1px solid #C68C4E",
          outline: "none",
          fontSize: "14px",
          borderRadius: "10px",
          padding: "0 12px",
        }}
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-sm text-gray-800">
                {suggestion.structured_formatting?.main_text || suggestion.description}
              </div>
              {suggestion.structured_formatting?.secondary_text && (
                <div className="text-sm text-gray-600">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopLocationAutocomplete;