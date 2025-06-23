import { useEffect, useRef, useState } from 'react';

const ShopLocationAutocomplete = ({ onSelect, value, onChange, placeholder = "Enter your shop location" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const componentRef = useRef(null);
  const timeoutRef = useRef(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

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
      // Using Google Places API directly with CORS
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(inputValue)}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
        if (data.status !== 'ZERO_RESULTS') {
          console.warn('API response status:', data.status);
        }
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setSuggestions([]);

      // Fallback: try with proxy
      try {
        const proxyResponse = await fetch(
          `/api/places/autocomplete/json?input=${encodeURIComponent(inputValue)}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`
        );

        if (proxyResponse.ok) {
          const proxyData = await proxyResponse.json();
          if (proxyData.status === 'OK' && proxyData.predictions) {
            setSuggestions(proxyData.predictions);
          }
        }
      } catch (proxyError) {
        console.error('Proxy request also failed:', proxyError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Call parent onChange if provided
    if (onChange) {
      onChange(e);
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce API calls
    timeoutRef.current = setTimeout(() => {
      fetchPlaces(newValue);
    }, 300);
  };

  const handleSuggestionClick = async (suggestion) => {
    const selectedAddress = suggestion.description;
    setInputValue(selectedAddress);
    setSuggestions([]);

    // Call parent onChange with selected value
    if (onChange) {
      onChange({ target: { value: selectedAddress } });
    }

    try {
      // Fetch place details to get coordinates
      let detailsResponse;

      try {
        // Try direct API call first
        detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`
        );
      } catch (error) {
        // Fallback to proxy
        detailsResponse = await fetch(
          `/api/places/details/json?place_id=${suggestion.place_id}&key=AIzaSyCZTRv24vE1zWXiLgKt5LbktOVGb1AeX_E`
        );
      }

      if (detailsResponse.ok) {
        const data = await detailsResponse.json();

        if (data.result && data.result.geometry) {
          const { lat, lng } = data.result.geometry.location;

          // Call onSelect with location data
          if (onSelect) {
            onSelect({
              address: selectedAddress,
              coordinates: [lat, lng],
              placeId: suggestion.place_id
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching place details:', error);

      // Still call onSelect with address even if coordinates failed
      if (onSelect) {
        onSelect({
          address: selectedAddress,
          coordinates: [0, 0], // Default coordinates
          placeId: suggestion.place_id
        });
      }
    }
  };

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" ref={componentRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "44px",
          background: "transparent",
          border: "1px solid #C68C4E",
          outline: "none",
          fontSize: "14px",
          borderRadius: "12px",
          padding: "0 12px",
        }}
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="font-medium text-sm text-gray-800">
                {suggestion.structured_formatting?.main_text || suggestion.description}
              </div>
              {suggestion.structured_formatting?.secondary_text && (
                <div className="text-xs text-gray-600 mt-1">
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